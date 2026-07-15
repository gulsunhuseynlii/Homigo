using Homigo.API.DTOs.Order;
using Homigo.API.Entities;
using Homigo.API.Enums;
using Homigo.API.Interfaces;
using Homigo.API.Repositories.Interfaces;

namespace Homigo.API.Services;

public class OrderService : IOrderService
{
    private readonly IOrderRepository _orderRepository;

    public OrderService(IOrderRepository orderRepository)
    {
        _orderRepository = orderRepository;
    }

    public async Task CreateAsync(int userId, CreateOrderDto dto)
    {
        var service = await _orderRepository.GetServiceAsync(dto.ServiceId);

        if (service == null)
            throw new Exception("Service not found.");

        var address = await _orderRepository.GetAddressAsync(dto.AddressId, userId);

        if (address == null)
            throw new Exception("Address not found.");

        var order = new Order
        {
            CustomerId = userId,
            ServiceId = dto.ServiceId,
            AddressId = dto.AddressId,
            ScheduledDate = dto.ScheduledDate,
            TotalPrice = service.BasePrice,
            Status = OrderStatus.Pending
        };

        await _orderRepository.AddAsync(order);
        await _orderRepository.SaveChangesAsync();
    }

    public async Task<List<OrderDto>> GetMyOrdersAsync(int userId)
    {
        var orders = await _orderRepository.GetCustomerOrdersAsync(userId);

        return orders.Select(x => new OrderDto
        {
            Id = x.Id,
            ServiceName = x.Service.Name,
            AddressTitle = x.Address.Title,
            TotalPrice = x.TotalPrice,
            ScheduledDate = x.ScheduledDate,
            Status = x.Status.ToString(),
            ProviderName = x.Provider?.FullName
        }).ToList();
    }
}