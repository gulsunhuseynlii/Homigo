using Homigo.API.Entities;

namespace Homigo.API.Repositories.Interfaces;

public interface IProviderRepository : IGenericRepository<ProviderProfile>
{
    Task<ProviderProfile?> GetByUserIdAsync(int userId);

    Task<List<ProviderProfile>> GetPendingAsync();

    Task<User?> GetUserWithRoleAsync(int userId);

    Task<Role?> GetProviderRoleAsync();
}