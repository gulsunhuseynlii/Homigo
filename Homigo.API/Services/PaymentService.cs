using Homigo.API.DTOs.Payment;
using Homigo.API.Entities;
using Homigo.API.Enums;
using Homigo.API.Interfaces;
using Homigo.API.Repositories.Interfaces;

namespace Homigo.API.Services;

public class PaymentService : IPaymentService
{
    private readonly IPaymentRepository _paymentRepository;

    public PaymentService(IPaymentRepository paymentRepository)
    {
        _paymentRepository = paymentRepository;
    }

    public async Task<PaymentDto> PayAsync(int customerId, CreatePaymentDto dto)
    {
        var order = await _paymentRepository.GetCompletedOrderAsync(dto.OrderId, customerId);

        if (order == null)
            throw new Exception("Completed order not found.");

        var exists = await _paymentRepository.PaymentExistsAsync(dto.OrderId);

        if (exists)
            throw new Exception("Payment already exists.");

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