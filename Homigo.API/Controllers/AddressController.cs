using Homigo.API.DTOs.Address;
using Homigo.API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Homigo.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AddressController : ControllerBase
{
    private readonly IAddressService _addressService;

    public AddressController(IAddressService addressService)
    {
        _addressService = addressService;
    }

    [HttpGet]
    public async Task<IActionResult> GetMyAddresses()
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var result = await _addressService.GetUserAddressesAsync(userId);

        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateAddressDto dto)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        await _addressService.CreateAsync(userId, dto);

        return Ok(new
        {
            message = "Address created successfully."
        });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, UpdateAddressDto dto)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        await _addressService.UpdateAsync(id, userId, dto);

        return Ok(new
        {
            message = "Address updated successfully."
        });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        await _addressService.DeleteAsync(id, userId);

        return Ok(new
        {
            message = "Address deleted successfully."
        });
    }
}