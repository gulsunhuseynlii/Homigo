using Homigo.API.Entities;

namespace Homigo.API.Repositories.Interfaces;

public interface IPaymentRepository : IGenericRepository<Payment>
{
    Task<Order?> GetOrderForPaymentAsync(int orderId, int customerId);

    Task<Order?> GetOrderByIdAsync(int orderId);

    Task<Payment?> GetByOrderIdAsync(int orderId);

    Task<bool> PaymentExistsAsync(int orderId);

    Task<List<Payment>> GetCustomerPaymentsAsync(int customerId);
}