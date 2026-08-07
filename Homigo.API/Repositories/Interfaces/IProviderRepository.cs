using Homigo.API.Entities;

namespace Homigo.API.Repositories.Interfaces;

public interface IProviderRepository : IGenericRepository<ProviderProfile>
{
    Task<ProviderProfile?> GetByUserIdAsync(int userId);

    Task<(List<ProviderProfile> Providers, int TotalCount)>
    GetPendingAsync(int page, int pageSize);

    Task<User?> GetUserWithRoleAsync(int userId);

    Task<Role?> GetProviderRoleAsync();
    Task<List<ProviderProfile>> GetAllApprovedAsync();

    Task<ProviderProfile?> GetApprovedByIdAsync(int id);
    Task<List<Service>> GetServicesByIdsAsync(List<int> serviceIds);
    Task<List<ProviderProfile>> GetApprovedProvidersAsync(int? serviceId);
    Task<double> GetAverageRatingAsync(int providerUserId);
    Task<int> GetReviewCountAsync(int providerUserId);

    Task<int> GetCompletedOrdersCountAsync(int providerUserId);
    Task<List<ProviderAvailability>> GetAvailabilitiesAsync(int providerId);

    Task DeleteAvailabilitiesAsync(int providerId);

    Task AddAvailabilitiesAsync(List<ProviderAvailability> availabilities);
    Task<List<Order>> GetOrdersByDateAsync(
    int providerUserId,
    DateTime date);
    Task<List<ProviderAvailability>> GetAvailabilitiesByUserIdAsync(int userId);
}