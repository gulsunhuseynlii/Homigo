using Homigo.API.DTOs.Address;

namespace Homigo.API.Interfaces;

public interface IAddressService
{
    Task<List<AddressDto>> GetUserAddressesAsync(int userId);

    Task CreateAsync(int userId, CreateAddressDto dto);

    Task UpdateAsync(int id, int userId, UpdateAddressDto dto);

    Task DeleteAsync(int id, int userId);
}