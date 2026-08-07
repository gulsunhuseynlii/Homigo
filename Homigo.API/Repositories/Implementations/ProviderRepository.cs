using Homigo.API.Data;
using Homigo.API.Entities;
using Homigo.API.Enums;
using Homigo.API.Repositories.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Homigo.API.Repositories.Implementations;

public class ProviderRepository
    : GenericRepository<ProviderProfile>, IProviderRepository
{
    private readonly AppDbContext _context;

    public ProviderRepository(AppDbContext context)
        : base(context)
    {
        _context = context;
    }

    public async Task<ProviderProfile?> GetByUserIdAsync(int userId)
    {
        return await _context.ProviderProfiles
            .FirstOrDefaultAsync(x => x.UserId == userId);
    }

    public async Task<(List<ProviderProfile> Providers, int TotalCount)> GetPendingAsync(int page, int pageSize)
    {
        var query = _context.ProviderProfiles
            .Include(x => x.User)
            .Include(x => x.Category)
            .Where(x => !x.IsApproved && !x.IsDeleted);

        var totalCount = await query.CountAsync();

        var providers = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (providers, totalCount);
    }

    public async Task<User?> GetUserWithRoleAsync(int userId)
    {
        return await _context.Users
            .Include(x => x.Role)
            .FirstOrDefaultAsync(x => x.Id == userId);
    }

    public async Task<Role?> GetProviderRoleAsync()
    {
        return await _context.Roles
            .FirstOrDefaultAsync(x => x.Name == "Provider");
    }
    public async Task<List<ProviderProfile>> GetAllApprovedAsync()
    {
        return await _context.ProviderProfiles
     .Include(x => x.User)
     .Include(x => x.Category)
     .Include(x => x.Reviews)
     .Where(x => x.IsApproved && !x.IsDeleted)
     .OrderByDescending(x =>
         x.Reviews.Any()
             ? x.Reviews.Average(r => r.Rating)
             : 0)
     .ToListAsync();
    }

    public async Task<ProviderProfile?> GetApprovedByIdAsync(int id)
    {
        return await _context.ProviderProfiles
            .Include(x => x.User)
            .Include(x => x.Category)
            .Include(x => x.Reviews)
            .Include(x => x.Services)
            .Include(x => x.Availabilities)
            .FirstOrDefaultAsync(x =>
                x.UserId == id &&
                x.IsApproved &&
                !x.IsDeleted);
    }
    public async Task<List<Service>> GetServicesByIdsAsync(List<int> serviceIds)
    {
        return await _context.Services
            .Where(x => serviceIds.Contains(x.Id) && !x.IsDeleted)
            .ToListAsync();
    }
    public async Task<List<ProviderProfile>> GetApprovedProvidersAsync(int? serviceId)
    {
        var query = _context.ProviderProfiles
     .Include(x => x.User)
     .Include(x => x.Category)
     .Include(x => x.Reviews)
     .Include(x => x.Services)
     .Where(x => x.IsApproved && !x.IsDeleted)
     .AsQueryable();

        if (serviceId.HasValue)
        {
            query = query.Where(x =>
                x.Services.Any(s => s.Id == serviceId.Value));
        }

        return await query.ToListAsync();
    }
    public async Task<double> GetAverageRatingAsync(int providerUserId)
    {
        return await _context.Reviews
            .Where(r => r.ProviderId == providerUserId)
            .AverageAsync(r => (double?)r.Rating) ?? 0;
    }
    public async Task<int> GetReviewCountAsync(int providerUserId)
    {
        return await _context.Reviews
            .CountAsync(r => r.ProviderId == providerUserId);
    }

    public async Task<int> GetCompletedOrdersCountAsync(int providerUserId)
    {
        return await _context.Orders
            .CountAsync(o =>
                o.ProviderId == providerUserId &&
                o.Status == OrderStatus.Completed);
    }
    public async Task<List<ProviderAvailability>> GetAvailabilitiesAsync(int providerId)
    {
        return await _context.ProviderAvailabilities
            .Where(x => x.ProviderId == providerId)
            .OrderBy(x => x.DayOfWeek)
            .ToListAsync();
    }

    public async Task DeleteAvailabilitiesAsync(int providerId)
    {
        var list = await _context.ProviderAvailabilities
            .Where(x => x.ProviderId == providerId)
            .ToListAsync();

        _context.ProviderAvailabilities.RemoveRange(list);
    }

    public async Task AddAvailabilitiesAsync(List<ProviderAvailability> availabilities)
    {
        await _context.ProviderAvailabilities.AddRangeAsync(availabilities);
    }
    public async Task<List<Order>> GetOrdersByDateAsync(
    int providerUserId,
    DateTime date)
    {

        return await _context.Orders
            .Where(x =>
                x.ProviderId == providerUserId &&
                x.ScheduledDate.Date == date.Date &&
                x.Status != OrderStatus.Cancelled)
            .ToListAsync();
    }
  
    public async Task<List<ProviderAvailability>>
GetAvailabilitiesByUserIdAsync(int userId)
    {
        return await _context.ProviderAvailabilities
            .Include(x => x.Provider)
            .Where(x => x.Provider.UserId == userId)
            .OrderBy(x => x.DayOfWeek)
            .ToListAsync();
    }
}