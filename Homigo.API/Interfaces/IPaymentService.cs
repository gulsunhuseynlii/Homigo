using Homigo.API.DTOs.Payment;

namespace Homigo.API.Interfaces;

public interface IPaymentService
{
    Task<PaymentDto> PayAsync(int customerId, CreatePaymentDto dto);

    Task<List<PaymentDto>> GetMyPaymentsAsync(int customerId);
}