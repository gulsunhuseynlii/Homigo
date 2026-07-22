using AutoMapper;
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
    private readonly IMapper _mapper;

    public OrderService(
        IOrderRepository orderRepository,
        ILogger<OrderService> logger,
        IMapper mapper)
    {
        _orderRepository = orderRepository;
        _logger = logger;
        _mapper = mapper;
    }

    public async Task CreateAsync(int userId, CreateOrderDto dto)
    {
        _logger.LogInformation(
            "Customer {UserId} is creating an order.",
            userId);

        var service = await _orderRepository.GetServiceAsync(dto.ServiceId);

        if (service == null)
        {
            throw new NotFoundException("Service not found.");
        }

        var address =
            await _orderRepository.GetAddressAsync(dto.AddressId, userId);

        if (address == null)
        {
            throw new NotFoundException("Address not found.");
        }

        var provider =
            await _orderRepository.GetApprovedProviderAsync(dto.ProviderId);

        if (provider == null)
        {
            throw new NotFoundException("Provider not found.");
        }

        var order = new Order
        {
            CustomerId = userId,
            ProviderId = dto.ProviderId,
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

        return _mapper.Map<List<OrderDto>>(orders);
    }

    public async Task<List<OrderDto>> GetPendingOrdersAsync()
    {
        _logger.LogInformation("Pending orders requested.");

        var orders = await _orderRepository.GetPendingOrdersAsync();

        return _mapper.Map<List<OrderDto>>(orders);
    }

    public async Task AcceptOrderAsync(int orderId, int providerUserId)
    {
        _logger.LogInformation(
            "Provider {ProviderId} is accepting order {OrderId}.",
            providerUserId,
            orderId);

        var provider =
            await _orderRepository.GetApprovedProviderAsync(providerUserId);

        if (provider == null)
            throw new NotFoundException("Provider not found.");

        var order =
            await _orderRepository.GetOrderByIdAsync(orderId);

        if (order == null)
            throw new NotFoundException("Order not found.");

        if (order.ProviderId != providerUserId)
            throw new BadRequestException("This order does not belong to you.");

        if (order.Status != OrderStatus.Pending)
            throw new BadRequestException("Order is not pending.");

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

        return _mapper.Map<List<OrderDto>>(orders);
    }

    public async Task StartOrderAsync(int orderId, int providerUserId)
    {
        _logger.LogInformation(
            "Provider {ProviderId} started order {OrderId}.",
            providerUserId,
            orderId);

        var order =
            await _orderRepository.GetOrderByIdAsync(orderId);

        if (order == null)
            throw new NotFoundException("Order not found.");

        if (order.ProviderId != providerUserId)
            throw new BadRequestException("This order does not belong to you.");

        if (order.Status != OrderStatus.Accepted)
            throw new BadRequestException("Order must be accepted first.");

        order.Status = OrderStatus.InProgress;

        await _orderRepository.UpdateAsync(order);
        await _orderRepository.SaveChangesAsync();

        _logger.LogInformation(
            "Order {OrderId} started successfully.",
            orderId);
    }

    public async Task CompleteOrderAsync(int orderId, int providerUserId)
    {
        _logger.LogInformation(
            "Provider {ProviderId} completed order {OrderId}.",
            providerUserId,
            orderId);

        var order =
            await _orderRepository.GetOrderByIdAsync(orderId);

        if (order == null)
            throw new NotFoundException("Order not found.");

        if (order.ProviderId != providerUserId)
            throw new BadRequestException("This order does not belong to you.");

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