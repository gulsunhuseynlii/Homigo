using AutoMapper;
using Homigo.API.DTOs.Address;
using Homigo.API.Entities;
using Homigo.API.Exceptions;
using Homigo.API.Interfaces;
using Homigo.API.Repositories.Interfaces;
using Microsoft.Extensions.Logging;

namespace Homigo.API.Services;

public class AddressService : IAddressService
{
    private readonly IAddressRepository _addressRepository;
    private readonly ILogger<AddressService> _logger;
    private readonly IMapper _mapper;

    public AddressService(
        IAddressRepository addressRepository,
        ILogger<AddressService> logger,
        IMapper mapper)
    {
        _addressRepository = addressRepository;
        _logger = logger;
        _mapper = mapper;
    }

    public async Task<List<AddressDto>> GetUserAddressesAsync(int userId)
    {
        _logger.LogInformation(
            "User {UserId} requested addresses.",
            userId);

        var addresses = await _addressRepository.GetUserAddressesAsync(userId);

        return _mapper.Map<List<AddressDto>>(addresses);
    }

    public async Task CreateAsync(int userId, CreateAddressDto dto)
    {
        _logger.LogInformation(
            "User {UserId} is creating a new address.",
            userId);

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

        _logger.LogInformation(
            "Address {AddressId} created successfully.",
            address.Id);
    }

    public async Task UpdateAsync(int id, int userId, UpdateAddressDto dto)
    {
        _logger.LogInformation(
            "User {UserId} is updating address {AddressId}.",
            userId,
            id);

        var address = await _addressRepository.GetByIdAndUserAsync(id, userId);

        if (address == null)
        {
            _logger.LogWarning(
                "Address {AddressId} not found for user {UserId}.",
                id,
                userId);

            throw new NotFoundException("Address not found.");
        }

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

        _logger.LogInformation(
            "Address {AddressId} updated successfully.",
            id);
    }

    public async Task DeleteAsync(int id, int userId)
    {
        _logger.LogInformation(
            "User {UserId} is deleting address {AddressId}.",
            userId,
            id);

        var address = await _addressRepository.GetByIdAndUserAsync(id, userId);

        if (address == null)
        {
            _logger.LogWarning(
                "Address {AddressId} not found for user {UserId}.",
                id,
                userId);

            throw new NotFoundException("Address not found.");
        }

        address.IsDeleted = true;

        await _addressRepository.UpdateAsync(address);
        await _addressRepository.SaveChangesAsync();

        _logger.LogInformation(
            "Address {AddressId} deleted successfully.",
            id);
    }
}