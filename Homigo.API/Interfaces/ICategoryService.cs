using Homigo.API.DTOs.Category;

namespace Homigo.API.Interfaces;

public interface ICategoryService
{
    Task<List<CategoryDto>> GetAllAsync();

    Task<CategoryDto> CreateAsync(CreateCategoryDto dto);
}
