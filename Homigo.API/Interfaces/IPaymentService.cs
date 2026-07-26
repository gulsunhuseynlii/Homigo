using Homigo.API.DTOs.Payment;

namespace Homigo.API.Interfaces;

public interface IPaymentService
{
    Task<CheckoutSessionDto> CreateCheckoutSessionAsync(
        int customerId,
        int orderId);

    Task<List<PaymentDto>> GetMyPaymentsAsync(
        int customerId);
 
}