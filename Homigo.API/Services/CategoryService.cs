using AutoMapper;
using Homigo.API.DTOs.Category;
using Homigo.API.Entities;
using Homigo.API.Interfaces;
using Homigo.API.Repositories.Interfaces;
using Microsoft.Extensions.Logging;

namespace Homigo.API.Services;

public class CategoryService : ICategoryService
{
    private readonly ICategoryRepository _categoryRepository;
    private readonly ILogger<CategoryService> _logger;
    private readonly IMapper _mapper;

    public CategoryService(
        ICategoryRepository categoryRepository,
        ILogger<CategoryService> logger,
        IMapper mapper)
    {
        _categoryRepository = categoryRepository;
        _logger = logger;
        _mapper = mapper;
    }

    public async Task<List<CategoryDto>> GetAllAsync()
    {
        _logger.LogInformation("Categories requested.");

        var categories = await _categoryRepository.GetAllAsync();

        return _mapper.Map<List<CategoryDto>>(categories);
    }

    public async Task<CategoryDto> CreateAsync(CreateCategoryDto dto)
    {
        _logger.LogInformation(
            "Creating category {CategoryName}.",
            dto.Name);

        var category = new Category
        {
            Name = dto.Name,
            Icon = dto.Icon,
            CreatedAt = DateTime.UtcNow
        };

        await _categoryRepository.AddAsync(category);
        await _categoryRepository.SaveChangesAsync();

        _logger.LogInformation(
            "Category {CategoryId} created successfully.",
            category.Id);

        return _mapper.Map<CategoryDto>(category);
    }
    public async Task UpdateAsync(int id, UpdateCategoryDto dto)
    {
        var category = await _categoryRepository.GetByIdAsync(id);

        if (category == null)
            throw new Exception("Category not found.");

        category.Name = dto.Name;
        category.Icon = dto.Icon;

        await _categoryRepository.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var category = await _categoryRepository.GetByIdAsync(id);

        if (category == null)
            throw new Exception("Category not found.");

        await _categoryRepository.Delete(category);

        await _categoryRepository.SaveChangesAsync();
    }
}