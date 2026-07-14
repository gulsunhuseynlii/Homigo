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

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<ProviderProfile>()
            .HasOne(x => x.User)
            .WithOne(x => x.ProviderProfile)
            .HasForeignKey<ProviderProfile>(x => x.UserId);
    }
}