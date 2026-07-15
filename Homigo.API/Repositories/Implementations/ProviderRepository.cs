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
}