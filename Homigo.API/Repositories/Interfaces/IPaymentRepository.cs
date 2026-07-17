using Homigo.API.Entities;

namespace Homigo.API.Repositories.Interfaces;

public interface IPaymentRepository : IGenericRepository<Payment>
{
    Task<Order?> GetCompletedOrderAsync(int orderId, int customerId);

    Task<bool> PaymentExistsAsync(int orderId);

    Task<List<Payment>> GetCustomerPaymentsAsync(int customerId);
}