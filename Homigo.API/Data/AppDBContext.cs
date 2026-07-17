using Homigo.API.Entities;
using Microsoft.EntityFrameworkCore;

namespace Homigo.API.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();

    public DbSet<Role> Roles => Set<Role>();

    public DbSet<Category> Categories => Set<Category>();

    public DbSet<Service> Services => Set<Service>();
    public DbSet<ProviderProfile> ProviderProfiles => Set<ProviderProfile>();
    public DbSet<Address> Addresses => Set<Address>();
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<Review> Reviews { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<ProviderProfile>()
            .HasOne(x => x.User)
            .WithOne(x => x.ProviderProfile)
            .HasForeignKey<ProviderProfile>(x => x.UserId);

        modelBuilder.Entity<Address>()
            .HasOne(x => x.User)
            .WithMany(x => x.Addresses)
            .HasForeignKey(x => x.UserId);

        modelBuilder.Entity<Order>()
            .HasOne(x => x.Customer)
            .WithMany(x => x.CustomerOrders)
            .HasForeignKey(x => x.CustomerId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Order>()
            .HasOne(x => x.Provider)
            .WithMany(x => x.ProviderOrders)
            .HasForeignKey(x => x.ProviderId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Order>()
            .HasOne(x => x.Service)
            .WithMany(x => x.Orders)
            .HasForeignKey(x => x.ServiceId);

        modelBuilder.Entity<Order>()
            .HasOne(x => x.Address)
            .WithMany(x => x.Orders)
            .HasForeignKey(x => x.AddressId);
        modelBuilder.Entity<Review>()
            .HasOne(x => x.Order)
            .WithOne(x => x.Review)
            .HasForeignKey<Review>(x => x.OrderId);

        modelBuilder.Entity<Review>()
            .HasOne(x => x.Customer)
            .WithMany(x => x.CustomerReviews)
            .HasForeignKey(x => x.CustomerId)
            .OnDelete(DeleteBehavior.NoAction);

        modelBuilder.Entity<Review>()
            .HasOne(x => x.Provider)
            .WithMany(x => x.ProviderReviews)
            .HasForeignKey(x => x.ProviderId)
            .OnDelete(DeleteBehavior.NoAction);
    }
}