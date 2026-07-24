using Homigo.API.DTOs.Service;

namespace Homigo.API.Interfaces;

public interface IServiceService
{
    Task<List<ServiceDto>> GetAllAsync(ServiceQueryDto query);

    Task<ServiceDto?> GetByIdAsync(int id);

    Task<ServiceDto> CreateAsync(int userId, CreateServiceDto dto);

    Task UpdateAsync(int userId, int serviceId, UpdateServiceDto dto);

    Task DeleteAsync(int userId, int serviceId);
    Task<List<ServiceDto>> GetMyServicesAsync(int userId);
}