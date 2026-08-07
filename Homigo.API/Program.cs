
using FluentValidation.AspNetCore;
using Hangfire;
using Hangfire.SqlServer;
using Homigo.API.Configurations;
using Homigo.API.Data;
using Homigo.API.Hubs;
using Homigo.API.Interfaces;
using Homigo.API.Jobs;
using Homigo.API.Mappings;
using Homigo.API.Middlewares;
using Homigo.API.Repositories.Implementations;
using Homigo.API.Repositories.Interfaces;
using Homigo.API.Services;
using Homigo.API.Settings;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace Homigo.API
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.

            builder.Services.AddControllers();

            builder.Services.AddSignalR();

            builder.Services.AddSingleton<IUserIdProvider, UserIdProvider>();

            builder.Services.Configure<StripeSettings>(
    builder.Configuration.GetSection("Stripe"));

            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddScoped<IAuthService, AuthService>();
            builder.Services.AddScoped<ICategoryService, CategoryService>();
            builder.Services.AddScoped<IServiceService, ServiceService>();
            builder.Services.AddScoped<IProviderService, ProviderService>();
            builder.Services.AddScoped<IAddressService, AddressService>();
            builder.Services.AddScoped<IOrderService, OrderService>();
            builder.Services.AddScoped<IReviewService, ReviewService>();
            builder.Services.AddScoped<IDashboardService, DashboardService>();
            builder.Services.AddScoped<IPaymentService, PaymentService>();
            builder.Services.AddScoped<IFavoriteService, FavoriteService>();
            builder.Services.AddScoped<IEmailService, EmailService>();
            builder.Services.AddScoped<IFileService, FileService>();
            builder.Services.AddScoped<IChatService, ChatService>();

            builder.Services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
            builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();
            builder.Services.AddScoped<IServiceRepository, ServiceRepository>();
            builder.Services.AddScoped<IProviderRepository, ProviderRepository>();
            builder.Services.AddScoped<IUserRepository, UserRepository>();
            builder.Services.AddScoped<IAddressRepository, AddressRepository>();
            builder.Services.AddScoped<IOrderRepository, OrderRepository>();
            builder.Services.AddScoped<IReviewRepository, ReviewRepository>();
            builder.Services.AddScoped<IDashboardRepository, DashboardRepository>();
            builder.Services.AddScoped<IPaymentRepository, PaymentRepository>();
            builder.Services.AddScoped<IFavoriteRepository, FavoriteRepository>();
            builder.Services.AddScoped<IChatRepository, ChatRepository>();

            builder.Services.AddScoped<ExpiredOrderJob>();
            builder.Services.AddScoped<AppointmentReminderJob>();

            builder.Services.AddSwaggerGen(options =>
            {
                options.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
                {
                    Name = "Authorization",
                    Type = Microsoft.OpenApi.Models.SecuritySchemeType.Http,
                    Scheme = "bearer",
                    BearerFormat = "JWT",
                    In = Microsoft.OpenApi.Models.ParameterLocation.Header,
                    Description = "JWT Token daxil edin."
                });

                options.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
            }); 
            
            builder.Services.AddDbContext<AppDbContext>(options =>
            {
                options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
            });


            builder.Services.AddHangfire(config =>
            {
                config.SetDataCompatibilityLevel(CompatibilityLevel.Version_180)
                      .UseSimpleAssemblyNameTypeSerializer()
                      .UseRecommendedSerializerSettings()
                      .UseSqlServerStorage(
                          builder.Configuration.GetConnectionString("DefaultConnection"),
                          new SqlServerStorageOptions
                          {
                              CommandBatchMaxTimeout = TimeSpan.FromMinutes(5),
                              SlidingInvisibilityTimeout = TimeSpan.FromMinutes(5),
                              QueuePollInterval = TimeSpan.Zero,
                              UseRecommendedIsolationLevel = true,
                              DisableGlobalLocks = true
                          });
            });

            builder.Services.AddHangfireServer();


            builder.Services.Configure<JwtSettings>(
            builder.Configuration.GetSection("Jwt"));

            builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
         .AddJwtBearer(options =>
        {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,

            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
        };
            options.Events = new JwtBearerEvents
            {
                OnMessageReceived = context =>
                {
                    var accessToken = context.Request.Query["access_token"];

                    var path = context.HttpContext.Request.Path;

                    options.Events = new JwtBearerEvents
                    {
                        OnMessageReceived = context =>
                        {
                            var accessToken = context.Request.Query["access_token"];
                            var path = context.HttpContext.Request.Path;

                            if (!string.IsNullOrEmpty(accessToken) &&
                                (path.StartsWithSegments("/notificationHub") ||
                                 path.StartsWithSegments("/chatHub")))
                            {
                                context.Token = accessToken;
                            }

                            return Task.CompletedTask;
                        }
                    };

                    return Task.CompletedTask;
                }
            };
        });
            builder.Services.AddFluentValidationAutoValidation();
            builder.Services.Configure<EmailSettings>(
    builder.Configuration.GetSection("EmailSettings"));
            builder.Services.AddAutoMapper(typeof(MappingProfile));

            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowReact", policy =>
                {
                    policy.WithOrigins("http://localhost:5173")
                          .AllowAnyHeader()
                          .AllowAnyMethod()
                          .AllowCredentials();
                });
            });
            Stripe.StripeConfiguration.ApiKey =
    builder.Configuration["Stripe:SecretKey"];
            var app = builder.Build();



            using (var scope = app.Services.CreateScope())
            {
                var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

                DbInitializer.Seed(context);
            }
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

           
            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseCors("AllowReact");
            app.UseMiddleware<ExceptionMiddleware>();

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseHangfireDashboard("/hangfire");

            RecurringJob.AddOrUpdate<ExpiredOrderJob>(
"expired-orders",
job => job.ExecuteAsync(),
"*/5 * * * *");
            RecurringJob.AddOrUpdate<AppointmentReminderJob>(
      "appointment-reminders",
      job => job.ExecuteAsync(),
      "* * * * *");
            app.MapControllers();

            app.MapHub<NotificationHub>("/notificationHub");
            app.MapHub<ChatHub>("/chatHub");
            app.Run();
        }
    }
}
