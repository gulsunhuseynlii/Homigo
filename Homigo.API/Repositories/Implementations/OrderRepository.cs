using Homigo.API.Data;
using Homigo.API.Entities;
using Homigo.API.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Homigo.API.Repositories.Implementations;

public class OrderRepository : GenericRepository<Order>, IOrderRepository
{
    private readonly AppDbContext _context;

    public OrderRepository(AppDbContext context)
        : base(context)
    {
        _context = context;
    }

    public async Task<Service?> GetServiceAsync(int serviceId)
    {
        return await _context.Services
            .FirstOrDefaultAsync(x => x.Id == serviceId && !x.IsDeleted);
    }

    public async Task<Address?> GetAddressAsync(int addressId, int userId)
    {
        return await _context.Addresses
            .FirstOrDefaultAsync(x =>
                x.Id == addressId &&
                x.UserId == userId &&
                !x.IsDeleted);
    }

    public async Task<List<Order>> GetCustomerOrdersAsync(int userId)
    {
        return await _context.Orders
            .Include(x => x.Service)
            .Include(x => x.Address)
            .Include(x => x.Provider)
            .Where(x => x.CustomerId == userId && !x.IsDeleted)
            .ToListAsync();
    }
}