using Homigo.API.Data;
using Homigo.API.DTOs.Service;
using Homigo.API.Entities;
using Homigo.API.Interfaces;
using Homigo.API.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Homigo.API.Services;

public class ServiceService : IServiceService
{
    private readonly IServiceRepository _serviceRepository;

    public ServiceService(IServiceRepository serviceRepository)
    {
        _serviceRepository = serviceRepository;
    }

    public async Task<List<ServiceDto>> GetAllAsync(ServiceQueryDto query)
    {
        var services = await _serviceRepository.GetAllAsync(query);

        return services.Select(x => new ServiceDto
        {
            Id = x.Id,
            Name = x.Name,
            Description = x.Description,
            BasePrice = x.BasePrice,
            EstimatedMinutes = x.EstimatedMinutes,
            ImageUrl = x.ImageUrl,
            CategoryId = x.CategoryId,
            CategoryName = x.Category.Name
        }).ToList();
    }
    public async Task<ServiceDto?> GetByIdAsync(int id)
    {
        var service = await _serviceRepository.GetByIdWithCategoryAsync(id);

        if (service == null)
            return null;

        return new ServiceDto
        {
            Id = service.Id,
            Name = service.Name,
            Description = service.Description,
            BasePrice = service.BasePrice,
            EstimatedMinutes = service.EstimatedMinutes,
            ImageUrl = service.ImageUrl,
            CategoryId = service.CategoryId,
            CategoryName = service.Category.Name
        };
    }
    public async Task<ServiceDto> CreateAsync(CreateServiceDto dto)
    {
        var category = await _serviceRepository.GetCategoryByIdAsync(dto.CategoryId);

        if (category == null)
            throw new Exception("Category not found.");

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

        return new ServiceDto
        {
            Id = service.Id,
            Name = service.Name,
            Description = service.Description,
            BasePrice = service.BasePrice,
            EstimatedMinutes = service.EstimatedMinutes,
            ImageUrl = service.ImageUrl,
            CategoryId = service.CategoryId,
            CategoryName = category.Name
        };
    }

    public async Task UpdateAsync(int id, UpdateServiceDto dto)
    {
        var service = await _serviceRepository.GetEntityByIdAsync(id);

        if (service == null)
            throw new Exception("Service not found.");

        var category = await _serviceRepository.GetCategoryByIdAsync(dto.CategoryId);

        if (category == null)
            throw new Exception("Category not found.");

        service.Name = dto.Name;
        service.Description = dto.Description;
        service.BasePrice = dto.BasePrice;
        service.EstimatedMinutes = dto.EstimatedMinutes;
        service.ImageUrl = dto.ImageUrl;
        service.CategoryId = dto.CategoryId;

        await _serviceRepository.UpdateAsync(service);
        await _serviceRepository.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var service = await _serviceRepository.GetEntityByIdAsync(id);

        if (service == null)
            throw new Exception("Service not found.");

        service.IsDeleted = true;

        await _serviceRepository.UpdateAsync(service);
        await _serviceRepository.SaveChangesAsync();
    }
}