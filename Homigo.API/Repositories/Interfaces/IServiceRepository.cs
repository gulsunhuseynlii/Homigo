using Homigo.API.DTOs.Service;
using Homigo.API.Entities;

namespace Homigo.API.Repositories.Interfaces;

public interface IServiceRepository : IGenericRepository<Service>
{
    Task<List<Service>> GetAllWithCategoryAsync();

    Task<Service?> GetByIdWithCategoryAsync(int id);

    Task<Service?> GetEntityByIdAsync(int id);

    Task<Category?> GetCategoryByIdAsync(int id);
}