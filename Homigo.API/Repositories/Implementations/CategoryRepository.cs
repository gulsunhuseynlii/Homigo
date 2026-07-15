using Homigo.API.Data;
using Homigo.API.DTOs.Category;
using Homigo.API.Entities;
using Homigo.API.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Homigo.API.Repositories.Implementations;

public class CategoryRepository
    : GenericRepository<Category>, ICategoryRepository
{
    private readonly AppDbContext _context;

    public CategoryRepository(AppDbContext context)
        : base(context)
    {
        _context = context;
    }

    public async Task<List<CategoryDto>> GetAllAsync()
    {
        return await _context.Categories
            .Where(x => !x.IsDeleted)
            .Select(x => new CategoryDto
            {
                Id = x.Id,
                Name = x.Name,
                Icon = x.Icon
            })
            .ToListAsync();
    }
}