using Homigo.API.Data;
using Homigo.API.Entities;
using Homigo.API.Enums;
using Homigo.API.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Homigo.API.Repositories.Implementations;

public class PaymentRepository
    : GenericRepository<Payment>, IPaymentRepository
{
    private readonly AppDbContext _context;

    public PaymentRepository(AppDbContext context)
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

    public async Task<bool> PaymentExistsAsync(int orderId)
    {
        return await _context.Payments
            .AnyAsync(x => x.OrderId == orderId);
    }

    public async Task<List<Payment>> GetCustomerPaymentsAsync(int customerId)
    {
        return await _context.Payments
            .Include(x => x.Order)
            .Where(x => x.Order.CustomerId == customerId)
            .OrderByDescending(x => x.CreatedAt)
            .ToListAsync();
    }
}