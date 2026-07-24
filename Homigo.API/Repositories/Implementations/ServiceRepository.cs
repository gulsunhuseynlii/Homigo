using Homigo.API.Data;
using Homigo.API.DTOs.Service;
using Homigo.API.Entities;
using Homigo.API.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Homigo.API.Repositories.Implementations;

public class ServiceRepository
    : GenericRepository<Service>, IServiceRepository
{
    private readonly AppDbContext _context;

    public ServiceRepository(AppDbContext context)
        : base(context)
    {
        _context = context;
    }

    public async Task<List<Service>> GetAllAsync(ServiceQueryDto query)
    {
        var services = _context.Services
            .Include(x => x.Provider)
                .ThenInclude(x => x.User)
            .Include(x => x.Provider)
                .ThenInclude(x => x.Category)
            .Where(x => !x.IsDeleted)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(query.Search))
        {
            services = services.Where(x =>
                x.Name.ToLower().Contains(query.Search.ToLower()));
        }

        if (query.CategoryId.HasValue)
        {
            services = services.Where(x =>
                x.Provider.CategoryId == query.CategoryId.Value);
        }

        if (!string.IsNullOrWhiteSpace(query.Sort))
        {
            switch (query.Sort.ToLower())
            {
                case "price":
                    services = services.OrderBy(x => x.BasePrice);
                    break;

                case "name":
                    services = services.OrderBy(x => x.Name);
                    break;
            }
        }

        return await services
            .Skip((query.Page - 1) * query.PageSize)
            .Take(query.PageSize)
            .ToListAsync();
    }

    public async Task<Service?> GetByIdAsync(int id)
    {
        return await _context.Services
            .Include(x => x.Provider)
                .ThenInclude(x => x.User)
            .Include(x => x.Provider)
                .ThenInclude(x => x.Category)
            .FirstOrDefaultAsync(x =>
                x.Id == id &&
                !x.IsDeleted);
    }

    public async Task<Service?> GetEntityByIdAsync(int id)
    {
        return await _context.Services
            .FirstOrDefaultAsync(x =>
                x.Id == id &&
                !x.IsDeleted);
    }

    public async Task<ProviderProfile?> GetProviderAsync(int providerId)
    {
        return await _context.ProviderProfiles
            .Include(x => x.User)
            .Include(x => x.Category)
            .FirstOrDefaultAsync(x =>
                x.Id == providerId &&
                x.IsApproved);
    }

    public async Task<List<Service>> GetProviderServicesAsync(int providerId)
    {
        return await _context.Services
            .Where(x =>
                x.ProviderId == providerId &&
                !x.IsDeleted)
            .ToListAsync();
    }
    public async Task<Service?> GetByIdAndProviderAsync(int serviceId, int providerId)
    {
        return await _context.Services
            .FirstOrDefaultAsync(x =>
                x.Id == serviceId &&
                x.ProviderId == providerId &&
                !x.IsDeleted);
    }
    public async Task<ProviderProfile?> GetProviderByUserIdAsync(int userId)
    {
        return await _context.ProviderProfiles
            .Include(x => x.User)
            .Include(x => x.Category)
            .FirstOrDefaultAsync(x =>
                x.UserId == userId &&
                x.IsApproved);
    }
    public async Task<Service?> GetWithProviderAsync(int serviceId)
    {
        return await _context.Services
            .Include(x => x.Provider)
            .FirstOrDefaultAsync(x =>
                x.Id == serviceId &&
                !x.IsDeleted);
    }
}