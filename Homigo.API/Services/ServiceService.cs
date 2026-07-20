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
        _logger.LogInformation("Services requested.");

        var services = await _serviceRepository.GetAllAsync(query);

        return _mapper.Map<List<ServiceDto>>(services);
    }

    public async Task<ServiceDto?> GetByIdAsync(int id)
    {
        _logger.LogInformation(
            "Service {ServiceId} requested.",
            id);

        var service = await _serviceRepository.GetByIdWithCategoryAsync(id);

        if (service == null)
        {
            _logger.LogWarning(
                "Service {ServiceId} not found.",
                id);

            return null;
        }

        return _mapper.Map<ServiceDto>(service);
    }

    public async Task<ServiceDto> CreateAsync(CreateServiceDto dto)
    {
        _logger.LogInformation(
            "Creating service {ServiceName}.",
            dto.Name);

        var category = await _serviceRepository.GetCategoryByIdAsync(dto.CategoryId);

        if (category == null)
        {
            _logger.LogWarning(
                "Category {CategoryId} not found.",
                dto.CategoryId);

            throw new NotFoundException("Category not found.");
        }

        var service = new Service
        {
            Name = dto.Name,
            Description = dto.Description,
            BasePrice = dto.BasePrice,
            EstimatedMinutes = dto.EstimatedMinutes,
            ImageUrl = dto.ImageUrl,
            CategoryId = dto.CategoryId,
            IsActive = true
        };

        await _serviceRepository.AddAsync(service);
        await _serviceRepository.SaveChangesAsync();

        service.Category = category;

        _logger.LogInformation(
            "Service {ServiceId} created successfully.",
            service.Id);

        return _mapper.Map<ServiceDto>(service);
    }

    public async Task UpdateAsync(int id, UpdateServiceDto dto)
    {
        _logger.LogInformation(
            "Updating service {ServiceId}.",
            id);

        var service = await _serviceRepository.GetEntityByIdAsync(id);

        if (service == null)
        {
            _logger.LogWarning(
                "Service {ServiceId} not found.",
                id);

            throw new NotFoundException("Service not found.");
        }

        var category = await _serviceRepository.GetCategoryByIdAsync(dto.CategoryId);

        if (category == null)
        {
            _logger.LogWarning(
                "Category {CategoryId} not found.",
                dto.CategoryId);

            throw new NotFoundException("Category not found.");
        }

        service.Name = dto.Name;
        service.Description = dto.Description;
        service.BasePrice = dto.BasePrice;
        service.EstimatedMinutes = dto.EstimatedMinutes;
        service.ImageUrl = dto.ImageUrl;
        service.CategoryId = dto.CategoryId;

        await _serviceRepository.UpdateAsync(service);
        await _serviceRepository.SaveChangesAsync();

        _logger.LogInformation(
            "Service {ServiceId} updated successfully.",
            id);
    }

    public async Task DeleteAsync(int id)
    {
        _logger.LogInformation(
            "Deleting service {ServiceId}.",
            id);

        var service = await _serviceRepository.GetEntityByIdAsync(id);

        if (service == null)
        {
            _logger.LogWarning(
                "Service {ServiceId} not found.",
                id);

            throw new NotFoundException("Service not found.");
        }

        service.IsDeleted = true;

        await _serviceRepository.UpdateAsync(service);
        await _serviceRepository.SaveChangesAsync();

        _logger.LogInformation(
            "Service {ServiceId} deleted successfully.",
            id);
    }
}