using Homigo.API.Data;
using Homigo.API.DTOs.Dashboard;
using Homigo.API.Enums;
using Homigo.API.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Homigo.API.Repositories.Implementations;

public class DashboardRepository : IDashboardRepository
{
    private readonly AppDbContext _context;

    public DashboardRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<AdminDashboardDto> GetAdminDashboardAsync()
    {
        return new AdminDashboardDto
        {
            TotalUsers = await _context.Users.CountAsync(),

            TotalProviders = await _context.Users
                .CountAsync(x => x.Role.Name == "Provider"),

            PendingProviders = await _context.ProviderProfiles
                .CountAsync(x => !x.IsApproved),

            TotalOrders = await _context.Orders.CountAsync(),

            PendingOrders = await _context.Orders
                .CountAsync(x => x.Status == OrderStatus.Pending),

            CompletedOrders = await _context.Orders
                .CountAsync(x => x.Status == OrderStatus.Completed),

            TotalRevenue = await _context.Orders
                .Where(x => x.Status == OrderStatus.Completed)
                .SumAsync(x => (decimal?)x.TotalPrice) ?? 0,

            TotalReviews = await _context.Reviews.CountAsync()
        };
    }
}