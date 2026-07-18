using Homigo.API.Data;
using Homigo.API.Entities;
using Homigo.API.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Homigo.API.Repositories.Implementations;

public class UserRepository : GenericRepository<User>, IUserRepository
{
    private readonly AppDbContext _context;

    public UserRepository(AppDbContext context)
        : base(context)
    {
        _context = context;
    }

    public async Task<User?> GetByEmailAsync(string email)
    {
        return await _context.Users
            .FirstOrDefaultAsync(x => x.Email == email);
    }

    public async Task<User?> GetByEmailWithRoleAsync(string email)
    {
        return await _context.Users
            .Include(x => x.Role)
            .FirstOrDefaultAsync(x => x.Email == email);
    }

    public async Task<Role?> GetCustomerRoleAsync()
    {
        return await _context.Roles
            .FirstOrDefaultAsync(x => x.Name == "Customer");
    }
    public async Task<User?> GetByIdAsync(int id)
    {
        return await _context.Users
            .FirstOrDefaultAsync(x => x.Id == id);
    }

    public async Task<EmailVerificationToken?> GetVerificationTokenAsync(string token)
    {
        return await _context.EmailVerificationTokens
            .Include(x => x.User)
            .FirstOrDefaultAsync(x =>
                x.Token == token &&
                !x.IsUsed);
    }

    public async Task AddVerificationTokenAsync(EmailVerificationToken token)
    {
        await _context.EmailVerificationTokens.AddAsync(token);
    }

    public async Task UpdateUserAsync(User user)
    {
        _context.Users.Update(user);
    }
}