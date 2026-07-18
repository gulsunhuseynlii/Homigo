using Homigo.API.Entities;

namespace Homigo.API.Repositories.Interfaces;

public interface IUserRepository : IGenericRepository<User>
{
    Task<User?> GetByEmailAsync(string email);

    Task<User?> GetByEmailWithRoleAsync(string email);

    Task<Role?> GetCustomerRoleAsync();
    Task<User?> GetByIdAsync(int id);

    Task<EmailVerificationToken?> GetVerificationTokenAsync(string token);

    Task AddVerificationTokenAsync(EmailVerificationToken token);

    Task UpdateUserAsync(User user);
}