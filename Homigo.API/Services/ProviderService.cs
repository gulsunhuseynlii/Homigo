using Homigo.API.DTOs.Provider;
using Homigo.API.Entities;
using Homigo.API.Interfaces;
using Homigo.API.Repositories.Interfaces;

namespace Homigo.API.Services;

public class ProviderService : IProviderService
{
    private readonly IProviderRepository _providerRepository;

    public ProviderService(IProviderRepository providerRepository)
    {
        _providerRepository = providerRepository;
    }

    public async Task ApplyAsync(int userId, ApplyProviderDto dto)
    {
        var user = await _providerRepository.GetUserWithRoleAsync(userId);

        if (user == null)
            throw new Exception("User not found.");

        if (user.Role.Name == "Admin")
            throw new Exception("Admin cannot apply as provider.");

        if (user.Role.Name == "Provider")
            throw new Exception("You are already a provider.");

        var exists = await _providerRepository.GetByUserIdAsync(userId);

        if (exists != null)
            throw new Exception("You have already applied.");

        var provider = new ProviderProfile
        {
            UserId = userId,
            Bio = dto.Bio,
            YearsOfExperience = dto.YearsOfExperience,
            IsApproved = false
        };

        await _providerRepository.AddAsync(provider);
        await _providerRepository.SaveChangesAsync();
    }

    public async Task<List<ProviderApplicationDto>> GetPendingApplicationsAsync()
    {
        var providers = await _providerRepository.GetPendingAsync();

        return providers.Select(x => new ProviderApplicationDto
        {
            UserId = x.UserId,
            FullName = x.User.FullName,
            Bio = x.Bio,
            YearsOfExperience = x.YearsOfExperience,
            IsApproved = x.IsApproved
        }).ToList();
    }

    public async Task ApproveAsync(int userId)
    {
        var provider = await _providerRepository.GetByUserIdAsync(userId);

        if (provider == null)
            throw new Exception("Provider application not found.");

        var providerRole = await _providerRepository.GetProviderRoleAsync();

        if (providerRole == null)
            throw new Exception("Provider role not found.");

        var user = await _providerRepository.GetUserWithRoleAsync(userId);

        if (user == null)
            throw new Exception("User not found.");

        provider.IsApproved = true;
        user.RoleId = providerRole.Id;

        await _providerRepository.SaveChangesAsync();
    }
}