using Homigo.API.DTOs.Order;
using Homigo.API.Entities;
using Homigo.API.Enums;
using Homigo.API.Exceptions;
using Homigo.API.Interfaces;
using Homigo.API.Repositories.Interfaces;
using Microsoft.Extensions.Logging;

namespace Homigo.API.Services;

public class OrderService : IOrderService
{
    private readonly IOrderRepository _orderRepository;
    private readonly ILogger<OrderService> _logger;

    public OrderService(
        IOrderRepository orderRepository,
        ILogger<OrderService> logger)
    {
        _orderRepository = orderRepository;
        _logger = logger;
    }

    public async Task CreateAsync(int userId, CreateOrderDto dto)
    {
        _logger.LogInformation(
            "Customer {UserId} is creating an order for service {ServiceId}",
            userId,
            dto.ServiceId);

        var service = await _orderRepository.GetServiceAsync(dto.ServiceId);

        if (service == null)
        {
            _logger.LogWarning("Service {ServiceId} not found.", dto.ServiceId);
            throw new NotFoundException("Service not found.");
        }

        var address = await _orderRepository.GetAddressAsync(dto.AddressId, userId);

        if (address == null)
        {
            _logger.LogWarning(
                "Address {AddressId} not found for user {UserId}.",
                dto.AddressId,
                userId);

            throw new NotFoundException("Address not found.");
        }

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

        _logger.LogInformation(
            "Order {OrderId} created successfully.",
            order.Id);
    }

    public async Task<List<OrderDto>> GetMyOrdersAsync(int userId)
    {
        _logger.LogInformation(
            "Customer {UserId} requested own orders.",
            userId);

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
        _logger.LogInformation("Pending orders requested.");

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
        _logger.LogInformation(
            "Provider {ProviderId} is accepting order {OrderId}.",
            providerUserId,
            orderId);

        var provider = await _orderRepository.GetProviderProfileAsync(providerUserId);

        if (provider == null)
        {
            _logger.LogWarning(
                "Provider profile not found. UserId: {ProviderId}",
                providerUserId);

            throw new NotFoundException("Provider profile not found.");
        }

        var order = await _orderRepository.GetOrderByIdAsync(orderId);

        if (order == null)
        {
            _logger.LogWarning("Order {OrderId} not found.", orderId);
            throw new NotFoundException("Order not found.");
        }

        if (order.Status != OrderStatus.Pending)
        {
            _logger.LogWarning(
                "Order {OrderId} is not pending.",
                orderId);

            throw new BadRequestException("Order is not pending.");
        }

        order.ProviderId = providerUserId;
        order.Status = OrderStatus.Accepted;

        await _orderRepository.UpdateAsync(order);
        await _orderRepository.SaveChangesAsync();

        _logger.LogInformation(
            "Order {OrderId} accepted successfully.",
            orderId);
    }

    public async Task<List<OrderDto>> GetMyProviderOrdersAsync(int providerUserId)
    {
        _logger.LogInformation(
            "Provider {ProviderId} requested own orders.",
            providerUserId);

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
        _logger.LogInformation(
            "Provider {ProviderId} started order {OrderId}.",
            providerUserId,
            orderId);

        var order = await _orderRepository.GetProviderOrderAsync(orderId, providerUserId);

        if (order == null)
            throw new NotFoundException("Order not found.");

        if (order.Status != OrderStatus.Accepted)
            throw new BadRequestException("Order must be accepted first.");

        order.Status = OrderStatus.InProgress;

        await _orderRepository.UpdateAsync(order);
        await _orderRepository.SaveChangesAsync();

        _logger.LogInformation(
            "Order {OrderId} is now in progress.",
            orderId);
    }

    public async Task CompleteOrderAsync(int orderId, int providerUserId)
    {
        _logger.LogInformation(
            "Provider {ProviderId} completed order {OrderId}.",
            providerUserId,
            orderId);

        var order = await _orderRepository.GetProviderOrderAsync(orderId, providerUserId);

        if (order == null)
            throw new NotFoundException("Order not found.");

        if (order.Status != OrderStatus.InProgress)
            throw new BadRequestException("Order is not in progress.");

        order.Status = OrderStatus.Completed;

        await _orderRepository.UpdateAsync(order);
        await _orderRepository.SaveChangesAsync();

        _logger.LogInformation(
            "Order {OrderId} completed successfully.",
            orderId);
    }
}