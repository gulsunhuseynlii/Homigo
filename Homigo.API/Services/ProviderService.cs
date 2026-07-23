using AutoMapper;
using Homigo.API.DTOs.Provider;
using Homigo.API.Entities;
using Homigo.API.Exceptions;
using Homigo.API.Interfaces;
using Homigo.API.Repositories.Interfaces;
using Microsoft.Extensions.Logging;

namespace Homigo.API.Services;

public class ProviderService : IProviderService
{
    private readonly IProviderRepository _providerRepository;
    private readonly IMapper _mapper;
    private readonly ILogger<ProviderService> _logger;
    private readonly IFileService _fileService;

    public ProviderService(
     IProviderRepository providerRepository,
     ILogger<ProviderService> logger,
     IMapper mapper,
     IFileService fileService)
    {
        _providerRepository = providerRepository;
        _logger = logger;
        _mapper = mapper;
        _fileService = fileService;
    }

    public async Task ApplyAsync(int userId, ApplyProviderDto dto)
    {
        _logger.LogInformation(
            "User {UserId} is applying as provider.",
            userId);

        var user = await _providerRepository.GetUserWithRoleAsync(userId);

        if (user == null)
        {
            _logger.LogWarning("User {UserId} not found.", userId);
            throw new NotFoundException("User not found.");
        }

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

            CategoryId = dto.CategoryId,

            PhoneNumber = dto.PhoneNumber,

            Bio = dto.Bio,

            YearsOfExperience = dto.YearsOfExperience,

            IsApproved = false,

            ProfileImageUrl = await _fileService.UploadAsync(
         dto.ProfileImage,
         "profiles",
         ".jpg",
         ".jpeg",
         ".png",
         ".webp"),

            IdentityCardUrl = await _fileService.UploadAsync(
         dto.IdentityCard,
         "identity",
         ".jpg",
         ".jpeg",
         ".png",
         ".pdf"),

            CvUrl = await _fileService.UploadAsync(
         dto.Cv,
         "cv",
         ".pdf",
         ".doc",
         ".docx"),

            CertificateUrl = dto.Certificate == null
         ? null
         : await _fileService.UploadAsync(
             dto.Certificate,
             "certificates",
             ".pdf",
             ".jpg",
             ".jpeg",
             ".png")
        };

        await _providerRepository.AddAsync(provider);
        await _providerRepository.SaveChangesAsync();

        _logger.LogInformation(
            "Provider application created successfully. UserId: {UserId}",
            userId);
    }

    public async Task<List<ProviderApplicationDto>> GetPendingApplicationsAsync()
    {
        _logger.LogInformation("Getting pending provider applications.");

        var providers = await _providerRepository.GetPendingAsync();

        return _mapper.Map<List<ProviderApplicationDto>>(providers);
    }

    public async Task ApproveAsync(int userId)
    {
        _logger.LogInformation(
            "Approving provider application for user {UserId}.",
            userId);

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

        _logger.LogInformation(
            "Provider approved successfully. UserId: {UserId}",
            userId);
    }

    public async Task<List<ProviderDto>> GetAllAsync()
    {
        _logger.LogInformation("Getting all approved providers.");

        var providers = await _providerRepository.GetAllApprovedAsync();

        return _mapper.Map<List<ProviderDto>>(providers);
    }

    public async Task<ProviderDto?> GetByIdAsync(int id)
    {
        _logger.LogInformation(
            "Getting provider with id {ProviderId}.",
            id);

        var provider = await _providerRepository.GetApprovedByIdAsync(id);

        if (provider == null)
            throw new NotFoundException("Provider not found.");

        return _mapper.Map<ProviderDto>(provider);
    }

    public async Task AssignServicesAsync(int providerId, AssignServicesDto dto)
    {
        _logger.LogInformation(
            "Assigning services to provider {ProviderId}.",
            providerId);

        var provider = await _providerRepository.GetApprovedByIdAsync(providerId);

        if (provider == null)
            throw new NotFoundException("Provider not found.");

        var services = await _providerRepository.GetServicesByIdsAsync(dto.ServiceIds);

        if (services.Count != dto.ServiceIds.Count)
            throw new BadRequestException("One or more services not found.");

        provider.Services.Clear();

        foreach (var service in services)
        {
            provider.Services.Add(service);
        }

        await _providerRepository.SaveChangesAsync();

        _logger.LogInformation(
            "Services assigned successfully to provider {ProviderId}.",
            providerId);
    }

    public async Task<List<ProviderDto>> GetAllAsync(int? serviceId)
    {
        _logger.LogInformation(
            "Getting approved providers. ServiceId: {ServiceId}",
            serviceId);

        var providers =
            await _providerRepository.GetApprovedProvidersAsync(serviceId);

        return _mapper.Map<List<ProviderDto>>(providers);
    }
}