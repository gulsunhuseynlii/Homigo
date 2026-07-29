using Homigo.API.Data;
using Homigo.API.Entities;
using Homigo.API.Enums;
using Homigo.API.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Homigo.API.Repositories.Implementations;

public class ReviewRepository
    : GenericRepository<Review>, IReviewRepository
{
    private readonly AppDbContext _context;

    public ReviewRepository(AppDbContext context)
        : base(context)
    {
        _context = context;
    }

    public async Task<Order?> GetCompletedOrderAsync(int orderId, int customerId)
    {
        return await _context.Orders
            .FirstOrDefaultAsync(x =>
                x.Id == orderId &&
                x.CustomerId == customerId &&
                x.Status == OrderStatus.Completed);
    }

    public async Task<List<Review>> GetProviderReviewsAsync(int providerId)
    {
        return await _context.Reviews
            .Include(x => x.Customer)
            .Where(x => x.ProviderId == providerId)
            .OrderByDescending(x => x.CreatedAt)
            .ToListAsync();
    }

    public async Task<bool> ReviewExistsAsync(int orderId)
    {
        return await _context.Reviews
            .AnyAsync(x => x.OrderId == orderId);
    }
    public async Task<bool> PaymentExistsAsync(int orderId)
    {
        return await _context.Payments
            .AnyAsync(x =>
                x.OrderId == orderId &&
                x.Status == PaymentStatus.Paid);
 
    }
    public async Task<List<Review>> GetServiceReviewsAsync(int serviceId)
    {
        return await _context.Reviews
            .Include(x => x.Customer)
            .Include(x => x.Order)
            .Where(x => x.Order.ServiceId == serviceId)
            .OrderByDescending(x => x.CreatedAt)
            .ToListAsync();
    }
}