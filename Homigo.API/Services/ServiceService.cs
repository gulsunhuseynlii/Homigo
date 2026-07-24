using AutoMapper;
using Homigo.API.DTOs.Service;
using Homigo.API.Entities;
using Homigo.API.Exceptions;
using Homigo.API.Interfaces;
using Homigo.API.Repositories.Interfaces;
using Microsoft.Extensions.Logging;

namespace Homigo.API.Services;

public class ServiceService : IServiceService
{
    private readonly IServiceRepository _serviceRepository;
    private readonly ILogger<ServiceService> _logger;
    private readonly IMapper _mapper;

    public ServiceService(
        IServiceRepository serviceRepository,
        ILogger<ServiceService> logger,
        IMapper mapper)
    {
        _serviceRepository = serviceRepository;
        _logger = logger;
        _mapper = mapper;
    }

    public async Task<List<ServiceDto>> GetAllAsync(ServiceQueryDto query)
    {
        _logger.LogInformation("Getting services.");

        var services = await _serviceRepository.GetAllAsync(query);

        return _mapper.Map<List<ServiceDto>>(services);
    }

    public async Task<ServiceDto?> GetByIdAsync(int id)
    {
        _logger.LogInformation(
            "Getting service {ServiceId}.",
            id);

        var service = await _serviceRepository.GetByIdAsync(id);

        if (service == null)
            throw new NotFoundException("Service not found.");

        return _mapper.Map<ServiceDto>(service);
    }

    public async Task<ServiceDto> CreateAsync(
        int userId,
        CreateServiceDto dto)
    {
        _logger.LogInformation(
            "Creating service for user {UserId}.",
            userId);

        var provider =
            await _serviceRepository.GetProviderByUserIdAsync(userId);

        if (provider == null)
            throw new NotFoundException("Provider not found.");

        var service = new Service
        {
            Name = dto.Name,
            Description = dto.Description,
            BasePrice = dto.BasePrice,
            EstimatedMinutes = dto.EstimatedMinutes,
            ImageUrl = dto.ImageUrl,
            ProviderId = provider.Id,
            IsActive = true
        };

        await _serviceRepository.AddAsync(service);
        await _serviceRepository.SaveChangesAsync();

        service.Provider = provider;

        _logger.LogInformation(
            "Service created successfully. Id: {ServiceId}",
            service.Id);

        return _mapper.Map<ServiceDto>(service);
    }
    public async Task UpdateAsync(
    int userId,
    int serviceId,
    UpdateServiceDto dto)
    {
        _logger.LogInformation(
            "Updating service {ServiceId} for user {UserId}.",
            serviceId,
            userId);

        var provider =
         await _serviceRepository.GetProviderByUserIdAsync(userId);

        Service? service;

        if (provider == null)
        {
            // Admin
            service = await _serviceRepository.GetEntityByIdAsync(serviceId);
        }
        else
        {
            // Provider
            service = await _serviceRepository.GetByIdAndProviderAsync(
                serviceId,
                provider.Id);
        }

        if (service == null)
            throw new NotFoundException("Service not found.");

        service.Name = dto.Name;
        service.Description = dto.Description;
        service.BasePrice = dto.BasePrice;
        service.EstimatedMinutes = dto.EstimatedMinutes;
        service.ImageUrl = dto.ImageUrl;

        await _serviceRepository.UpdateAsync(service);
        await _serviceRepository.SaveChangesAsync();

        _logger.LogInformation(
            "Service {ServiceId} updated successfully.",
            serviceId);
    }

    public async Task DeleteAsync(
        int userId,
        int serviceId)
    {
        _logger.LogInformation(
            "Deleting service {ServiceId} for user {UserId}.",
            serviceId,
            userId);

        var provider =
     await _serviceRepository.GetProviderByUserIdAsync(userId);

        Service? service;

        if (provider == null)
        {
            // Admin
            service = await _serviceRepository.GetEntityByIdAsync(serviceId);
        }
        else
        {
            // Provider
            service = await _serviceRepository.GetByIdAndProviderAsync(
                serviceId,
                provider.Id);
        }

        if (service == null)
            throw new NotFoundException("Service not found.");


        service.IsDeleted = true;

        await _serviceRepository.UpdateAsync(service);
        await _serviceRepository.SaveChangesAsync();

        _logger.LogInformation(
            "Service {ServiceId} deleted successfully.",
            serviceId);
    }
}