using Homigo.API.Data;
using Homigo.API.DTOs.Service;
using Homigo.API.Entities;
using Homigo.API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Homigo.API.Services;

public class ServiceService : IServiceService
{
    private readonly AppDbContext _context;

    public ServiceService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<ServiceDto>> GetAllAsync()
    {
        return await _context.Services
            .Include(x => x.Category)
            .Where(x => !x.IsDeleted)
            .Select(x => new ServiceDto
            {
                Id = x.Id,
                Name = x.Name,
                BasePrice = x.BasePrice,
                CategoryId = x.CategoryId,
                CategoryName = x.Category.Name
            })
            .ToListAsync();
    }

    public async Task<ServiceDto?> GetByIdAsync(int id)
    {
        var service = await _context.Services
            .Include(x => x.Category)
            .FirstOrDefaultAsync(x => x.Id == id && !x.IsDeleted);

        if (service == null)
            return null;

        return new ServiceDto
        {
            Id = service.Id,
            Name = service.Name,
            BasePrice = service.BasePrice,
            CategoryId = service.CategoryId,
            CategoryName = service.Category.Name
        };
    }

    public async Task<ServiceDto> CreateAsync(CreateServiceDto dto)
    {
        var category = await _context.Categories
            .FirstOrDefaultAsync(x => x.Id == dto.CategoryId && !x.IsDeleted);

        if (category == null)
            throw new Exception("Category not found.");

        var service = new Service
        {
            Name = dto.Name,
            BasePrice = dto.BasePrice,
            CategoryId = dto.CategoryId
        };

        _context.Services.Add(service);
        await _context.SaveChangesAsync();

        return new ServiceDto
        {
            Id = service.Id,
            Name = service.Name,
            BasePrice = service.BasePrice,
            CategoryId = service.CategoryId,
            CategoryName = category.Name
        };
    }

    public async Task UpdateAsync(int id, UpdateServiceDto dto)
    {
        var service = await _context.Services.FindAsync(id);

        if (service == null || service.IsDeleted)
            throw new Exception("Service not found.");

        service.Name = dto.Name;
        service.BasePrice = dto.BasePrice;
        service.CategoryId = dto.CategoryId;

        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var service = await _context.Services.FindAsync(id);

        if (service == null || service.IsDeleted)
            throw new Exception("Service not found.");

        service.IsDeleted = true;

        await _context.SaveChangesAsync();
    }
}