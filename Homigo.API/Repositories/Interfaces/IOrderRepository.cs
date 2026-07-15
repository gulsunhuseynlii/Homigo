using Homigo.API.Entities;

namespace Homigo.API.Repositories.Interfaces;

public interface IOrderRepository : IGenericRepository<Order>
{
    Task<Service?> GetServiceAsync(int serviceId);

    Task<Address?> GetAddressAsync(int addressId, int userId);

    Task<List<Order>> GetCustomerOrdersAsync(int userId);
}