using AutoMapper;
using Homigo.API.DTOs.Payment;
using Homigo.API.Entities;
using Homigo.API.Enums;
using Homigo.API.Exceptions;
using Homigo.API.Interfaces;
using Homigo.API.Repositories.Interfaces;
using Microsoft.Extensions.Logging;
using Stripe.Checkout;

namespace Homigo.API.Services;

public class PaymentService : IPaymentService
{
    private readonly IPaymentRepository _paymentRepository;
    private readonly ILogger<PaymentService> _logger;
    private readonly IMapper _mapper;
    private readonly IConfiguration _configuration;
    private readonly IOrderRepository _orderRepository;

    public PaymentService(
      IPaymentRepository paymentRepository,
      IOrderRepository orderRepository,
      ILogger<PaymentService> logger,
      IMapper mapper,
      IConfiguration configuration)
    {
        _paymentRepository = paymentRepository;
        _orderRepository = orderRepository;
        _logger = logger;
        _mapper = mapper;
        _configuration = configuration;
    }

    public async Task<CheckoutSessionDto> CreateCheckoutSessionAsync(
     int customerId,
     int orderId)
    {
        _logger.LogInformation(
            "Customer {CustomerId} is creating Stripe checkout for order {OrderId}.",
            customerId,
            orderId);

        var order = await _paymentRepository
            .GetOrderForPaymentAsync(orderId, customerId);

        if (order == null)
            throw new NotFoundException("Order not found.");

        var exists =
            await _paymentRepository.PaymentExistsAsync(orderId);

        if (exists)
            throw new BadRequestException("Payment already exists.");

        var options = new SessionCreateOptions
        {
            Mode = "payment",

            SuccessUrl =
                $"http://localhost:5173/payment-success?session_id={{CHECKOUT_SESSION_ID}}",

            CancelUrl =
                "http://localhost:5173/payment-cancel",

            Metadata = new Dictionary<string, string>
        {
            { "orderId", order.Id.ToString() },
            { "customerId", customerId.ToString() }
        },

            PaymentIntentData = new SessionPaymentIntentDataOptions
            {
                Metadata = new Dictionary<string, string>
            {
                { "orderId", order.Id.ToString() },
                { "customerId", customerId.ToString() }
            }
            },

            LineItems = new List<SessionLineItemOptions>
        {
            new SessionLineItemOptions
            {
                Quantity = 1,

                PriceData = new SessionLineItemPriceDataOptions
                {
                    Currency = "usd",

                    UnitAmount = (long)(order.TotalPrice * 100),

                    ProductData =
                        new SessionLineItemPriceDataProductDataOptions
                        {
                            Name = $"Homigo - Order #{order.Id}"
                        }
                }
            }
        }
        };

        var sessionService = new SessionService();

        var session = await sessionService.CreateAsync(options);

        _logger.LogInformation(
            "Stripe Checkout Session {SessionId} created for order {OrderId}.",
            session.Id,
            order.Id);

        return new CheckoutSessionDto
        {
            Url = session.Url!
        };
    }

    public async Task<List<PaymentDto>> GetMyPaymentsAsync(int customerId)
    {
        _logger.LogInformation(
            "Customer {CustomerId} requested payment history.",
            customerId);

        var payments = await _paymentRepository.GetCustomerPaymentsAsync(customerId);

        return _mapper.Map<List<PaymentDto>>(payments);
    }
    public async Task RefundPaymentAsync(int orderId)
    {
        _logger.LogInformation(
            "Refund requested for order {OrderId}.",
            orderId);

        var payment =
            await _paymentRepository.GetByOrderIdAsync(orderId);

        if (payment == null)
            throw new NotFoundException("Payment not found.");

        if (payment.Status == PaymentStatus.Refunded)
            throw new BadRequestException("Payment already refunded.");
        var order = await _paymentRepository.GetOrderByIdAsync(orderId);

        if (order == null)
            throw new NotFoundException("Order not found.");

        var refundService = new Stripe.RefundService();

        var options = new Stripe.RefundCreateOptions
        {
            PaymentIntent = payment.TransactionId
        };

        await refundService.CreateAsync(options);

        payment.Status = PaymentStatus.Refunded;
        order.PaymentStatus = PaymentStatus.Refunded;

        await _paymentRepository.UpdateAsync(payment);
        await _orderRepository.UpdateAsync(order);

        await _paymentRepository.SaveChangesAsync();

        _logger.LogInformation(
            "Refund completed for order {OrderId}.",
            orderId);
    }
}