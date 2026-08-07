using Homigo.API.DTOs.Common;
using Homigo.API.DTOs.Provider;
using Homigo.API.DTOs.ProviderAvailability;

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
    Task UpdateAvailabilityAsync(
    int userId,
    UpdateProviderAvailabilityDto dto);

    Task<List<ProviderAvailabilityDto>> GetAvailabilityAsync(
        int providerId);
    Task<List<AvailableSlotDto>> GetAvailableSlotsAsync(
    int providerUserId,
    DateTime date);
  
}