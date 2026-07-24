using Homigo.API.DTOs.Service;
using Homigo.API.Entities;

namespace Homigo.API.Repositories.Interfaces;

public interface IServiceRepository : IGenericRepository<Service>
{
    Task<List<Service>> GetAllAsync(ServiceQueryDto query);

    Task<Service?> GetByIdAsync(int id);

    Task<Service?> GetEntityByIdAsync(int id);

    Task<ProviderProfile?> GetProviderAsync(int providerId);

    Task<ProviderProfile?> GetProviderByUserIdAsync(int userId);

    Task<List<Service>> GetProviderServicesAsync(int providerId);

    Task<Service?> GetByIdAndProviderAsync(int serviceId, int providerId);
    Task<Service?> GetWithProviderAsync(int serviceId);
}