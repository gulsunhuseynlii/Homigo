using Homigo.API.Data;
using Homigo.API.DTOs.Provider;
using Homigo.API.Entities;
using Homigo.API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Homigo.API.Services;

public class ProviderService : IProviderService
{
    private readonly AppDbContext _context;

    public ProviderService(AppDbContext context)
    {
        _context = context;
    }

    public async Task ApplyAsync(int userId, ApplyProviderDto dto)
    {
        var exists = await _context.ProviderProfiles
            .AnyAsync(x => x.UserId == userId);

        if (exists)
            throw new Exception("You have already applied.");

        var provider = new ProviderProfile
        {
            UserId = userId,
            Bio = dto.Bio,
            YearsOfExperience = dto.YearsOfExperience,
            IsApproved = false
        };

        _context.ProviderProfiles.Add(provider);

        await _context.SaveChangesAsync();
    }
    public async Task<List<ProviderApplicationDto>> GetPendingApplicationsAsync()
    {
        return await _context.ProviderProfiles
            .Include(x => x.User)
            .Where(x => !x.IsApproved)
            .Select(x => new ProviderApplicationDto
            {
                UserId = x.UserId,
                FullName = x.User.FullName,
                Bio = x.Bio,
                YearsOfExperience = x.YearsOfExperience,
                IsApproved = x.IsApproved
            })
            .ToListAsync();
    }
    public async Task ApproveAsync(int userId)
    {
        var provider = await _context.ProviderProfiles
            .FirstOrDefaultAsync(x => x.UserId == userId);

        if (provider == null)
            throw new Exception("Provider application not found.");

        provider.IsApproved = true;

        var providerRole = await _context.Roles
            .FirstAsync(x => x.Name == "Provider");

        var user = await _context.Users
            .FirstAsync(x => x.Id == userId);

        user.RoleId = providerRole.Id;

        await _context.SaveChangesAsync();
    }
}