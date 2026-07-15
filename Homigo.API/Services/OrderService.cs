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
    public async Task<List<OrderDto>> GetPendingOrdersAsync()
    {
        var orders = await _orderRepository.GetPendingOrdersAsync();

        return orders.Select(x => new OrderDto
        {
            Id = x.Id,
            ServiceName = x.Service.Name,
            AddressTitle = x.Address.Title,
            TotalPrice = x.TotalPrice,
            ScheduledDate = x.ScheduledDate,
            Status = x.Status.ToString(),
            ProviderName = null
        }).ToList();
    }
    public async Task AcceptOrderAsync(int orderId, int providerUserId)
    {
        var provider = await _orderRepository.GetProviderProfileAsync(providerUserId);

        if (provider == null)
            throw new Exception("Provider profile not found.");

        var order = await _orderRepository.GetOrderByIdAsync(orderId);

        if (order == null)
            throw new Exception("Order not found.");

        if (order.Status != OrderStatus.Pending)
            throw new Exception("Order is not pending.");

        order.ProviderId = providerUserId;
        order.Status = OrderStatus.Accepted;

        await _orderRepository.UpdateAsync(order);
        await _orderRepository.SaveChangesAsync();
    }
    public async Task<List<OrderDto>> GetMyProviderOrdersAsync(int providerUserId)
    {
        var orders = await _orderRepository.GetProviderOrdersAsync(providerUserId);

        return orders.Select(x => new OrderDto
        {
            Id = x.Id,
            ServiceName = x.Service.Name,
            AddressTitle = x.Address.Title,
            TotalPrice = x.TotalPrice,
            ScheduledDate = x.ScheduledDate,
            Status = x.Status.ToString(),
            ProviderName = null
        }).ToList();
    }
    public async Task StartOrderAsync(int orderId, int providerUserId)
    {
        var order = await _orderRepository.GetProviderOrderAsync(orderId, providerUserId);

        if (order == null)
            throw new Exception("Order not found.");

        if (order.Status != OrderStatus.Accepted)
            throw new Exception("Order must be accepted first.");

        order.Status = OrderStatus.InProgress;

        await _orderRepository.UpdateAsync(order);
        await _orderRepository.SaveChangesAsync();
    }
    public async Task CompleteOrderAsync(int orderId, int providerUserId)
    {
        var order = await _orderRepository.GetProviderOrderAsync(orderId, providerUserId);

        if (order == null)
            throw new Exception("Order not found.");

        if (order.Status != OrderStatus.InProgress)
            throw new Exception("Order is not in progress.");

        order.Status = OrderStatus.Completed;

        await _orderRepository.UpdateAsync(order);
        await _orderRepository.SaveChangesAsync();
    }
}