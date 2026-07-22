using Homigo.API.DTOs.Category;

namespace Homigo.API.Interfaces;

public interface ICategoryService
{
    Task<List<CategoryDto>> GetAllAsync();

    Task<CategoryDto> CreateAsync(CreateCategoryDto dto);
    Task UpdateAsync(int id, UpdateCategoryDto dto);

    Task DeleteAsync(int id);
}
