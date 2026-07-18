using Homigo.API.DTOs.Payment;
using Homigo.API.Entities;
using Homigo.API.Enums;
using Homigo.API.Interfaces;
using Homigo.API.Repositories.Interfaces;
using Microsoft.Extensions.Logging;

namespace Homigo.API.Services;

public class PaymentService : IPaymentService
{
    private readonly IPaymentRepository _paymentRepository;
    private readonly ILogger<PaymentService> _logger;

    public PaymentService(
        IPaymentRepository paymentRepository,
        ILogger<PaymentService> logger)
    {
        _paymentRepository = paymentRepository;
        _logger = logger;
    }

    public async Task<PaymentDto> PayAsync(int customerId, CreatePaymentDto dto)
    {
        _logger.LogInformation(
            "Customer {CustomerId} is trying to pay for order {OrderId}.",
            customerId,
            dto.OrderId);

        var order = await _paymentRepository.GetCompletedOrderAsync(dto.OrderId, customerId);

        if (order == null)
        {
            _logger.LogWarning(
                "Completed order {OrderId} not found for customer {CustomerId}.",
                dto.OrderId,
                customerId);

            throw new Exception("Completed order not found.");
        }

        var exists = await _paymentRepository.PaymentExistsAsync(dto.OrderId);

        if (exists)
        {
            _logger.LogWarning(
                "Payment already exists for order {OrderId}.",
                dto.OrderId);

            throw new Exception("Payment already exists.");
        }

        var payment = new Payment
        {
            OrderId = order.Id,
            Amount = order.TotalPrice,
            PaymentMethod = dto.PaymentMethod,
            Status = PaymentStatus.Paid,
            TransactionId = Guid.NewGuid().ToString(),
            CreatedAt = DateTime.UtcNow
        };

        await _paymentRepository.AddAsync(payment);
        await _paymentRepository.SaveChangesAsync();

        _logger.LogInformation(
            "Payment {PaymentId} created successfully for order {OrderId}.",
            payment.Id,
            payment.OrderId);

        return new PaymentDto
        {
            Id = payment.Id,
            OrderId = payment.OrderId,
            Amount = payment.Amount,
            PaymentMethod = payment.PaymentMethod,
            Status = payment.Status,
            TransactionId = payment.TransactionId,
            CreatedAt = payment.CreatedAt
        };
    }

    public async Task<List<PaymentDto>> GetMyPaymentsAsync(int customerId)
    {
        _logger.LogInformation(
            "Customer {CustomerId} requested payment history.",
            customerId);

        var payments = await _paymentRepository.GetCustomerPaymentsAsync(customerId);

        return payments.Select(x => new PaymentDto
        {
            Id = x.Id,
            OrderId = x.OrderId,
            Amount = x.Amount,
            PaymentMethod = x.PaymentMethod,
            Status = x.Status,
            TransactionId = x.TransactionId,
            CreatedAt = x.CreatedAt
        }).ToList();
    }
}