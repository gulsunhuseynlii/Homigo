using Homigo.API.Entities;

namespace Homigo.API.Repositories.Interfaces;

public interface IReviewRepository : IGenericRepository<Review>
{
    Task<Order?> GetCompletedOrderAsync(int orderId, int customerId);

    Task<List<Review>> GetProviderReviewsAsync(int providerId);

    Task<bool> ReviewExistsAsync(int orderId);
    Task<bool> PaymentExistsAsync(int orderId);
    Task<List<Review>> GetServiceReviewsAsync(int serviceId);
}