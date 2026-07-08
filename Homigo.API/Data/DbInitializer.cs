using Homigo.API.Entities;

namespace Homigo.API.Data;

public static class DbInitializer
{
    public static void Seed(AppDbContext context)
    {
        if (!context.Roles.Any())
        {
            context.Roles.AddRange(
                new Role { Name = "Admin" },
                new Role { Name = "Customer" },
                new Role { Name = "Provider" }
            );

            context.SaveChanges();
        }
    }
}