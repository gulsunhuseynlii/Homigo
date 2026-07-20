using Homigo.API.DTOs.Provider;

namespace Homigo.API.Interfaces;

public interface IProviderService
{
    Task ApplyAsync(int userId, ApplyProviderDto dto);
    Task<List<ProviderApplicationDto>> GetPendingApplicationsAsync();

    Task ApproveAsync(int userId);
    Task<List<ProviderDto>> GetAllAsync();

    Task<ProviderDto?> GetByIdAsync(int id);
}