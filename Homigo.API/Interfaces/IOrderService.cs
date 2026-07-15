using Homigo.API.DTOs.Order;

namespace Homigo.API.Interfaces;

public interface IOrderService
{
    Task CreateAsync(int userId, CreateOrderDto dto);

    Task<List<OrderDto>> GetMyOrdersAsync(int userId);

    Task<List<OrderDto>> GetPendingOrdersAsync();

    Task AcceptOrderAsync(int orderId, int providerUserId);

    Task<List<OrderDto>> GetMyProviderOrdersAsync(int providerUserId);

    Task StartOrderAsync(int orderId, int providerUserId);

    Task CompleteOrderAsync(int orderId, int providerUserId);
}