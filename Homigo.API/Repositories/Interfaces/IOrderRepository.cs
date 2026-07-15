using Homigo.API.Entities;
using Homigo.API.Repositories.Interfaces;

public interface IOrderRepository : IGenericRepository<Order>
{
    Task<Service?> GetServiceAsync(int serviceId);

    Task<Address?> GetAddressAsync(int addressId, int userId);

    Task<List<Order>> GetCustomerOrdersAsync(int userId);

    Task<List<Order>> GetPendingOrdersAsync();

    Task<Order?> GetOrderByIdAsync(int id);

    Task<ProviderProfile?> GetProviderProfileAsync(int userId);

    Task<List<Order>> GetProviderOrdersAsync(int providerUserId);

    Task<Order?> GetProviderOrderAsync(int orderId, int providerUserId);
}