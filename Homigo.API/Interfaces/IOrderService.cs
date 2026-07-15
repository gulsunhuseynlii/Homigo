using Homigo.API.DTOs.Order;

namespace Homigo.API.Interfaces;

public interface IOrderService
{
    Task CreateAsync(int userId, CreateOrderDto dto);

    Task<List<OrderDto>> GetMyOrdersAsync(int userId);
}