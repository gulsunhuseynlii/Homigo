using Homigo.API.Entities;

namespace Homigo.API.Repositories.Interfaces;

public interface ICategoryRepository : IGenericRepository<Category>
{
    Task<List<Category>> GetAllAsync();
    Task<Category?> GetByIdAsync(int id);

    Task Delete(Category category);
}