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

    public PaymentService(
        IPaymentRepository paymentRepository,
        ILogger<PaymentService> logger,
        IMapper mapper,
        IConfiguration configuration)
    {
        _paymentRepository = paymentRepository;
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
}