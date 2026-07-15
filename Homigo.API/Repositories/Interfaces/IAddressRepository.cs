using Homigo.API.Entities;

namespace Homigo.API.Repositories.Interfaces;

public interface IAddressRepository : IGenericRepository<Address>
{
    Task<List<Address>> GetUserAddressesAsync(int userId);

    Task<Address?> GetByIdAndUserAsync(int id, int userId);
}