using Homigo.API.Data;
using Homigo.API.Entities;
using Homigo.API.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Homigo.API.Repositories.Implementations;

public class FavoriteRepository
    : GenericRepository<Favorite>, IFavoriteRepository
{
    private readonly AppDbContext _context;

    public FavoriteRepository(AppDbContext context)
        : base(context)
    {
        _context = context;
    }

    public async Task<bool> ExistsAsync(int userId, int serviceId)
    {
        return await _context.Favorites
            .AnyAsync(x =>
                x.UserId == userId &&
                x.ServiceId == serviceId);
    }

    public async Task<Service?> GetServiceAsync(int serviceId)
    {
        return await _context.Services
            .FirstOrDefaultAsync(x =>
                x.Id == serviceId &&
                !x.IsDeleted);
    }

    public async Task<List<Favorite>> GetUserFavoritesAsync(int userId)
    {
        return await _context.Favorites
            .Include(x => x.Service)
            .ThenInclude(x => x.Category)
            .Where(x => x.UserId == userId)
            .ToListAsync();
    }

    public async Task<Favorite?> GetFavoriteAsync(int userId, int serviceId)
    {
        return await _context.Favorites
            .FirstOrDefaultAsync(x =>
                x.UserId == userId &&
                x.ServiceId == serviceId);
    }
}