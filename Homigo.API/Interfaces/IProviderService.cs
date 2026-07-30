using Homigo.API.DTOs.Common;
using Homigo.API.DTOs.Provider;

namespace Homigo.API.Interfaces;

public interface IProviderService
{
    Task ApplyAsync(int userId, ApplyProviderDto dto);
    Task<PagedResult<ProviderApplicationDto>>
     GetPendingApplicationsAsync(ProviderQueryDto query);

    Task ApproveAsync(int userId);
    Task<List<ProviderDto>> GetAllAsync();

    Task<ProviderDto?> GetByIdAsync(int id);
    Task AssignServicesAsync(int providerId, AssignServicesDto dto);
    Task<List<ProviderDto>> GetAllAsync(int? serviceId);
    Task RejectAsync(int userId);
}