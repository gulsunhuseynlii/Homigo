using Homigo.API.Data;
using Homigo.API.DTOs.Service;
using Homigo.API.Entities;
using Homigo.API.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Homigo.API.Repositories.Implementations;

public class ServiceRepository
    : GenericRepository<Service>, IServiceRepository
{
    private readonly AppDbContext _context;

    public ServiceRepository(AppDbContext context)
        : base(context)
    {
        _context = context;
    }

    public async Task<List<Service>> GetAllWithCategoryAsync()
    {
        return await _context.Services
            .Include(x => x.Category)
            .Where(x => !x.IsDeleted)
            .ToListAsync();
    }

    public async Task<Service?> GetByIdWithCategoryAsync(int id)
    {
        return await _context.Services
            .Include(x => x.Category)
            .FirstOrDefaultAsync(x => x.Id == id && !x.IsDeleted);
    }

    public async Task<Category?> GetCategoryByIdAsync(int id)
    {
        return await _context.Categories
            .FirstOrDefaultAsync(x => x.Id == id && !x.IsDeleted);
    }
    public async Task<Service?> GetEntityByIdAsync(int id)
    {
        return await _context.Services
            .FirstOrDefaultAsync(x => x.Id == id && !x.IsDeleted);
    }
}