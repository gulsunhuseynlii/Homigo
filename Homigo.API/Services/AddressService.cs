using Homigo.API.DTOs.Address;
using Homigo.API.Entities;
using Homigo.API.Exceptions;
using Homigo.API.Interfaces;
using Homigo.API.Repositories.Interfaces;

namespace Homigo.API.Services;

public class AddressService : IAddressService
{
    private readonly IAddressRepository _addressRepository;

    public AddressService(IAddressRepository addressRepository)
    {
        _addressRepository = addressRepository;
    }

    public async Task<List<AddressDto>> GetUserAddressesAsync(int userId)
    {
        var addresses = await _addressRepository.GetUserAddressesAsync(userId);

        return addresses.Select(x => new AddressDto
        {
            Id = x.Id,
            Title = x.Title,
            City = x.City,
            District = x.District,
            Street = x.Street,
            Building = x.Building,
            Apartment = x.Apartment,
            Notes = x.Notes,
            IsDefault = x.IsDefault
        }).ToList();
    }

    public async Task CreateAsync(int userId, CreateAddressDto dto)
    {
        var address = new Address
        {
            UserId = userId,
            Title = dto.Title,
            City = dto.City,
            District = dto.District,
            Street = dto.Street,
            Building = dto.Building,
            Apartment = dto.Apartment,
            Notes = dto.Notes,
            IsDefault = dto.IsDefault
        };

        await _addressRepository.AddAsync(address);
        await _addressRepository.SaveChangesAsync();
    }

    public async Task UpdateAsync(int id, int userId, UpdateAddressDto dto)
    {
        var address = await _addressRepository.GetByIdAndUserAsync(id, userId);

        if (address == null)
            throw new NotFoundException("Address not found.");

        address.Title = dto.Title;
        address.City = dto.City;
        address.District = dto.District;
        address.Street = dto.Street;
        address.Building = dto.Building;
        address.Apartment = dto.Apartment;
        address.Notes = dto.Notes;
        address.IsDefault = dto.IsDefault;

        await _addressRepository.UpdateAsync(address);
        await _addressRepository.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id, int userId)
    {
        var address = await _addressRepository.GetByIdAndUserAsync(id, userId);

        if (address == null)
            throw new NotFoundException("Address not found.");

        address.IsDeleted = true;

        await _addressRepository.UpdateAsync(address);
        await _addressRepository.SaveChangesAsync();
    }
}