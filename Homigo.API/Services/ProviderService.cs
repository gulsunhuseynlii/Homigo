using AutoMapper;
using Homigo.API.DTOs.Provider;
using Homigo.API.Entities;
using Homigo.API.Exceptions;
using Homigo.API.Interfaces;
using Homigo.API.Repositories.Interfaces;

namespace Homigo.API.Services;

public class ProviderService : IProviderService
{
    private readonly IProviderRepository _providerRepository;
    private readonly IMapper _mapper;
    private readonly ILogger<ProviderService> _logger;

    public ProviderService(
        IProviderRepository providerRepository,
        IMapper mapper,
        ILogger<ProviderService> logger)
    {
        _providerRepository = providerRepository;
        _mapper = mapper;
        _logger = logger;
    }

    public async Task ApplyAsync(int userId, ApplyProviderDto dto)
    {
        var user = await _providerRepository.GetUserWithRoleAsync(userId);

        if (user == null)
            throw new NotFoundException("User not found.");

        if (user.Role.Name == "Admin")
            throw new BadRequestException("Admin cannot apply as provider.");

        if (user.Role.Name == "Provider")
            throw new BadRequestException("You are already a provider.");

        var exists = await _providerRepository.GetByUserIdAsync(userId);

        if (exists != null)
            throw new BadRequestException("You have already applied.");

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
            throw new NotFoundException("Provider application not found.");

        var providerRole = await _providerRepository.GetProviderRoleAsync();

        if (providerRole == null)
            throw new NotFoundException("Provider role not found.");

        var user = await _providerRepository.GetUserWithRoleAsync(userId);

        if (user == null)
            throw new NotFoundException("User not found.");

        provider.IsApproved = true;
        user.RoleId = providerRole.Id;

        await _providerRepository.SaveChangesAsync();
    }
    public async Task<List<ProviderDto>> GetAllAsync()
    {
        _logger.LogInformation("Getting all approved providers.");

        var providers = await _providerRepository.GetAllApprovedAsync();

        return providers.Select(x => new ProviderDto
        {
            Id = x.Id,
            FullName = x.User.FullName,
            Email = x.User.Email,
            PhoneNumber = x.User.PhoneNumber,
            Experience = $"{x.YearsOfExperience} years",
            Bio = x.Bio,
            AverageRating = x.Reviews.Any()
                ? x.Reviews.Average(r => r.Rating)
                : 0
        }).ToList();
    }
    public async Task<ProviderDto?> GetByIdAsync(int id)
    {
        _logger.LogInformation(
            "Getting provider with id {ProviderId}",
            id);

        var provider = await _providerRepository.GetApprovedByIdAsync(id);

        if (provider == null)
            throw new NotFoundException("Provider not found.");

        return new ProviderDto
        {
            Id = provider.Id,
            FullName = provider.User.FullName,
            Email = provider.User.Email,
            PhoneNumber = provider.User.PhoneNumber,
            Experience = $"{provider.YearsOfExperience} years",
            Bio = provider.Bio,
            AverageRating = provider.Reviews.Any()
                ? provider.Reviews.Average(r => r.Rating)
                : 0
        };
    }
}