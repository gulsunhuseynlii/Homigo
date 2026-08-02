using Homigo.API.Entities;

namespace Homigo.API.Repositories.Interfaces;

public interface IOrderRepository : IGenericRepository<Order>
{
    Task<Service?> GetServiceAsync(int serviceId);

    Task<Address?> GetAddressAsync(int addressId, int userId);

    Task<ProviderProfile?> GetApprovedProviderAsync(int providerUserId);

    Task<(List<Order> Orders, int TotalCount)> GetCustomerOrdersAsync(
    int userId,
    int page,
    int pageSize);

    Task<(List<Order> Orders, int TotalCount)> GetProviderOrdersAsync(
        int providerUserId,
        int page,
        int pageSize);

    Task<Order?> GetOrderByIdAsync(int id);
    Task<List<Order>> GetExpiredPendingOrdersAsync();
    Task<List<Order>> GetOrdersForReminderAsync();
}