using Homigo.API.DTOs.Common;
using Homigo.API.DTOs.Order;

namespace Homigo.API.Interfaces;

public interface IOrderService
{
    Task<int> CreateAsync(int userId, CreateOrderDto dto);

    Task<PagedResult<OrderDto>> GetMyOrdersAsync(
    int userId,
    OrderQueryDto query);

    Task AcceptOrderAsync(int orderId, int providerUserId);

    Task<PagedResult<OrderDto>> GetMyProviderOrdersAsync(
    int providerUserId,
    OrderQueryDto query);
    Task StartOrderAsync(int orderId, int providerUserId);

    Task CompleteOrderAsync(int orderId, int providerUserId);

    Task CancelOrderAsync(int orderId, int customerId);

    Task RejectOrderAsync(int orderId, int providerUserId);
    Task AutoCancelExpiredOrdersAsync();
    Task SendAppointmentRemindersAsync();
}