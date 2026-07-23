using Homigo.API.Data;
using Homigo.API.Entities;
using Homigo.API.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

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

    public async Task<List<ProviderProfile>> GetPendingAsync()
    {
        return await _context.ProviderProfiles
     .Include(x => x.User)
     .Include(x => x.Category)
     .Where(x => !x.IsApproved)
     .ToListAsync();
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
     .Where(x => x.IsApproved)
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
     .FirstOrDefaultAsync(x => x.Id == id && x.IsApproved);
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
     .Where(x => x.IsApproved)
     .AsQueryable();

        if (serviceId.HasValue)
        {
            query = query.Where(x =>
                x.Services.Any(s => s.Id == serviceId.Value));
        }

        return await query.ToListAsync();
    }
}