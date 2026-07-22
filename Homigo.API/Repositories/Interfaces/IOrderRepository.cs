using Homigo.API.Entities;

namespace Homigo.API.Repositories.Interfaces;

public interface IOrderRepository : IGenericRepository<Order>
{
    Task<Service?> GetServiceAsync(int serviceId);

    Task<Address?> GetAddressAsync(int addressId, int userId);

    Task<ProviderProfile?> GetApprovedProviderAsync(int providerUserId);

    Task<List<Order>> GetCustomerOrdersAsync(int userId);

    Task<List<Order>> GetProviderOrdersAsync(int providerUserId);

    Task<Order?> GetOrderByIdAsync(int id);
    Task<List<Order>> GetPendingOrdersAsync();
}