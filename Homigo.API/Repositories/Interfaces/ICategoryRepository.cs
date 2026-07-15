using Homigo.API.DTOs.Category;
using Homigo.API.Entities;

namespace Homigo.API.Repositories.Interfaces;

public interface ICategoryRepository : IGenericRepository<Category>
{
    Task<List<CategoryDto>> GetAllAsync();
}