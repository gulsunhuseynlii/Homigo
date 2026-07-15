using Homigo.API.Data;
using Homigo.API.Entities;
using Homigo.API.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Homigo.API.Repositories.Implementations;

public class AddressRepository : GenericRepository<Address>, IAddressRepository
{
    private readonly AppDbContext _context;

    public AddressRepository(AppDbContext context)
        : base(context)
    {
        _context = context;
    }

    public async Task<List<Address>> GetUserAddressesAsync(int userId)
    {
        return await _context.Addresses
            .Where(x => x.UserId == userId && !x.IsDeleted)
            .ToListAsync();
    }

    public async Task<Address?> GetByIdAndUserAsync(int id, int userId)
    {
        return await _context.Addresses
            .FirstOrDefaultAsync(x =>
                x.Id == id &&
                x.UserId == userId &&
                !x.IsDeleted);
    }
}