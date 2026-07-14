using Homigo.API.DTOs.Service;

namespace Homigo.API.Interfaces;

public interface IServiceService
{
    Task<List<ServiceDto>> GetAllAsync();

    Task<ServiceDto?> GetByIdAsync(int id);

    Task<ServiceDto> CreateAsync(CreateServiceDto dto);

    Task UpdateAsync(int id, UpdateServiceDto dto);

    Task DeleteAsync(int id);
}