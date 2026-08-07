using AutoMapper;
using Hangfire;
using Homigo.API.DTOs.Common;
using Homigo.API.DTOs.Order;
using Homigo.API.Entities;
using Homigo.API.Enums;
using Homigo.API.Exceptions;
using Homigo.API.Interfaces;
using Homigo.API.Repositories.Interfaces;
using Microsoft.Extensions.Logging;
using Homigo.API.Hubs;
using Microsoft.AspNetCore.SignalR;

namespace Homigo.API.Services;

public class OrderService : IOrderService
{
    private readonly IOrderRepository _orderRepository;
    private readonly ILogger<OrderService> _logger;
    private readonly IMapper _mapper;
    private readonly IPaymentRepository _paymentRepository;
    private readonly IPaymentService _paymentService;
    private readonly IEmailService _emailService;
    private readonly IHubContext<NotificationHub> _hubContext;

    public OrderService(
     IOrderRepository orderRepository,
     IPaymentRepository paymentRepository,
      IPaymentService paymentService,
     IMapper mapper,
     ILogger<OrderService> logger,
     IEmailService emailService, IHubContext<NotificationHub> hubContext)
    {
        _orderRepository = orderRepository;
        _paymentRepository = paymentRepository;
        _paymentService = paymentService;
        _mapper = mapper;
        _logger = logger;
        _emailService = emailService;
        _hubContext = hubContext;
    }

    public async Task<int> CreateAsync(
    int userId,
    CreateOrderDto dto)
    {
        _logger.LogInformation(
            "Customer {UserId} is creating an order.",
            userId);

        var service =
            await _orderRepository.GetServiceAsync(dto.ServiceId);

        if (service == null)
            throw new NotFoundException("Service not found.");

        var address =
            await _orderRepository.GetAddressAsync(
                dto.AddressId,
                userId);

        if (address == null)
            throw new NotFoundException("Address not found.");

        var provider =
            await _orderRepository.GetApprovedProviderAsync(
                dto.ProviderId);

        if (provider == null)
            throw new NotFoundException("Provider not found.");

        var order = new Order
        {
            CustomerId = userId,
            ProviderId = dto.ProviderId,
            ServiceId = dto.ServiceId,
            AddressId = dto.AddressId,
            ScheduledDate = dto.ScheduledDate,
            TotalPrice = service.BasePrice,
            Status = OrderStatus.Pending,
            PaymentStatus = PaymentStatus.Unpaid
        };

        await _orderRepository.AddAsync(order);
        await _orderRepository.SaveChangesAsync();
        _logger.LogInformation(
   "Order ProviderId: {ProviderId}",
   order.ProviderId);

        _logger.LogInformation(
            "CustomerId: {CustomerId}",
            order.CustomerId);
        await _hubContext
     .Clients
     .User(order.ProviderId.ToString())
     .SendAsync(
         "ReceiveNotification",
         new
         {
             message = "You have a new booking!"
         });
       
        _logger.LogInformation(
            "Order {OrderId} created successfully.",
            order.Id);

        return order.Id;
    }

    public async Task<PagedResult<OrderDto>> GetMyOrdersAsync(
    int userId,
    OrderQueryDto query)
    {
        _logger.LogInformation(
            "Customer {UserId} requested own orders.",
            userId);

        var (orders, totalCount) =
            await _orderRepository.GetCustomerOrdersAsync(
                userId,
                query.Page,
                query.PageSize);

        return new PagedResult<OrderDto>
        {
            Items = _mapper.Map<List<OrderDto>>(orders),
            TotalCount = totalCount,
            Page = query.Page,
            PageSize = query.PageSize
        };
    }

    public async Task AcceptOrderAsync(int orderId, int providerUserId)
    {
        _logger.LogInformation(
            "Provider {ProviderId} is accepting order {OrderId}.",
            providerUserId,
            orderId);

        var order = await _orderRepository.GetOrderByIdAsync(orderId);

        if (order == null)
            throw new NotFoundException("Order not found.");

        if (order.ProviderId != providerUserId)
            throw new BadRequestException("This order does not belong to you.");

        if (order.Status != OrderStatus.Pending)
            throw new BadRequestException("Order is not pending.");

        order.Status = OrderStatus.Accepted;

        await _orderRepository.UpdateAsync(order);
        await _orderRepository.SaveChangesAsync();

        await _hubContext.Clients.All.SendAsync(
            "ReceiveNotification",
            new
            {
                Title = "Order Accepted",
                Message = $"{order.Service.Name} booking has been accepted.",
                OrderId = order.Id
            });

        BackgroundJob.Enqueue<IEmailService>(x =>
            x.SendOrderAcceptedEmailAsync(
                order.Customer.Email,
                order.Customer.FullName));

        _logger.LogInformation(
            "Order {OrderId} accepted successfully.",
            orderId);
    }

    public async Task<PagedResult<OrderDto>> GetMyProviderOrdersAsync(
     int providerUserId,
     OrderQueryDto query)
    {
        _logger.LogInformation(
            "Provider {ProviderId} requested own orders.",
            providerUserId);

        var (orders, totalCount) =
            await _orderRepository.GetProviderOrdersAsync(
                providerUserId,
                query.Page,
                query.PageSize);

        return new PagedResult<OrderDto>
        {
            Items = _mapper.Map<List<OrderDto>>(orders),
            TotalCount = totalCount,
            Page = query.Page,
            PageSize = query.PageSize
        };
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

        Hangfire.BackgroundJob.Enqueue<IEmailService>(x =>
            x.SendOrderCompletedEmailAsync(
                order.Customer.Email,
                order.Customer.FullName));

        _logger.LogInformation(
            "Order {OrderId} completed successfully.",
            orderId);
    }
    public async Task CancelOrderAsync(int orderId, int customerId)
    {
        _logger.LogInformation(
            "Customer {CustomerId} is cancelling order {OrderId}.",
            customerId,
            orderId);

        var order = await _orderRepository.GetOrderByIdAsync(orderId);

        if (order == null)
            throw new NotFoundException("Order not found.");

        if (order.CustomerId != customerId)
            throw new BadRequestException("This order does not belong to you.");

        if (order.Status != OrderStatus.Pending)
            throw new BadRequestException("Only pending orders can be cancelled.");

        order.Status = OrderStatus.Cancelled;
       

        if (order.PaymentStatus == PaymentStatus.Paid)
        {
            await _paymentService.RefundPaymentAsync(orderId);
        }

        await _orderRepository.UpdateAsync(order);
        await _orderRepository.SaveChangesAsync();

        _logger.LogInformation(
            "Order {OrderId} cancelled successfully.",
            orderId);
    }
    public async Task RejectOrderAsync(int orderId, int providerUserId)
    {
        _logger.LogInformation(
            "Provider {ProviderId} is rejecting order {OrderId}.",
            providerUserId,
            orderId);

        var order = await _orderRepository.GetOrderByIdAsync(orderId);

        if (order == null)
            throw new NotFoundException("Order not found.");

        if (order.ProviderId != providerUserId)
            throw new BadRequestException("This order does not belong to you.");

        if (order.Status != OrderStatus.Pending)
            throw new BadRequestException("Order is not pending.");

        order.Status = OrderStatus.Rejected;
 

        if (order.PaymentStatus == PaymentStatus.Paid)
        {
            await _paymentService.RefundPaymentAsync(orderId);
        }

        await _orderRepository.UpdateAsync(order);
        await _orderRepository.SaveChangesAsync();

        _logger.LogInformation(
            "Order {OrderId} rejected successfully.",
            orderId);
    }

    public async Task AutoCancelExpiredOrdersAsync()
    {
        _logger.LogInformation("Checking expired pending orders...");

        var orders = await _orderRepository.GetExpiredPendingOrdersAsync();

        foreach (var order in orders)
        {
            order.Status = OrderStatus.Cancelled;

            if (order.PaymentStatus == PaymentStatus.Paid)
            {
                await _paymentService.RefundPaymentAsync(order.Id);
            }

            await _orderRepository.UpdateAsync(order);
        }

        await _orderRepository.SaveChangesAsync();

        _logger.LogInformation(
            "{Count} expired orders cancelled.",
            orders.Count);
    }
    public async Task SendAppointmentRemindersAsync()
    {
        _logger.LogInformation("Checking appointment reminders...");

        var orders = await _orderRepository.GetOrdersForReminderAsync();

        _logger.LogInformation("Found {Count} orders for reminder.", orders.Count);

        foreach (var order in orders)
        {
            await _emailService.SendAppointmentReminderEmailAsync(
                order.Customer.Email,
                order.Customer.FullName,
                order.Service.Name,
                order.ScheduledDate);

            order.ReminderEmailSent = true;

            await _orderRepository.UpdateAsync(order);
        }

        await _orderRepository.SaveChangesAsync();

        _logger.LogInformation(
            "{Count} reminder emails sent.",
            orders.Count);
    }
}