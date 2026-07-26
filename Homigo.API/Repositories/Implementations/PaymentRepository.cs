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

    public async Task<Order?> GetOrderForPaymentAsync(
        int orderId,
        int customerId)
    {
        return await _context.Orders
            .FirstOrDefaultAsync(x =>
                x.Id == orderId &&
                x.CustomerId == customerId &&
                x.PaymentStatus == PaymentStatus.Unpaid &&
                x.Status != OrderStatus.Cancelled &&
                x.Status != OrderStatus.Rejected);
    }

    public async Task<bool> PaymentExistsAsync(int orderId)
    {
        return await _context.Payments
            .AnyAsync(x => x.OrderId == orderId);
    }

    public async Task<List<Payment>> GetCustomerPaymentsAsync(
        int customerId)
    {
        return await _context.Payments
            .Include(x => x.Order)
            .Where(x => x.Order.CustomerId == customerId)
            .OrderByDescending(x => x.CreatedAt)
            .ToListAsync();
    }
    public async Task<Payment?> GetByOrderIdAsync(int orderId)
    {
        return await _context.Payments
            .FirstOrDefaultAsync(x => x.OrderId == orderId);
    }
    public async Task<Order?> GetOrderByIdAsync(int orderId)
    {
        return await _context.Orders
            .FirstOrDefaultAsync(x => x.Id == orderId);
    }
}