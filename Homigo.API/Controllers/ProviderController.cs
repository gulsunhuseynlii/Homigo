using Homigo.API.DTOs.Provider;
using Homigo.API.DTOs.ProviderAvailability;
using Homigo.API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Homigo.API.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class ProviderController : ControllerBase
{
    private readonly IProviderService _providerService;

    public ProviderController(IProviderService providerService)
    {
        _providerService = providerService;
    }

    [HttpPost("apply")]
    public async Task<IActionResult> Apply([FromForm] ApplyProviderDto dto)
    {
        var userId = int.Parse(
            User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        await _providerService.ApplyAsync(userId, dto);

        return Ok(new
        {
            message = "Your provider application has been submitted successfully."
        });
    }

    [Authorize(Roles = "Admin")]
    [HttpGet("pending")]
    public async Task<IActionResult> GetPending(
     [FromQuery] ProviderQueryDto query)
    {
        var result =
            await _providerService.GetPendingApplicationsAsync(query);

        return Ok(result);
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("approve/{userId}")]
    public async Task<IActionResult> Approve(int userId)
    {
        await _providerService.ApproveAsync(userId);

        return Ok(new
        {
            message = "Provider approved successfully."
        });
    }
    [AllowAnonymous]
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await _providerService.GetAllAsync();

        return Ok(result);
    }

    [AllowAnonymous]
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _providerService.GetByIdAsync(id);

        return Ok(result);
    }
    [Authorize(Roles = "Admin")]
    [HttpPut("{providerId}/services")]
    public async Task<IActionResult> AssignServices(
    int providerId,
    AssignServicesDto dto)
    {
        await _providerService.AssignServicesAsync(providerId, dto);

        return Ok(new
        {
            message = "Services assigned successfully."
        });
    }
    [AllowAnonymous]
    [HttpGet("filter")]
    public async Task<IActionResult> GetAll(
    [FromQuery] int? serviceId)
    {
        var result =
            await _providerService.GetAllAsync(serviceId);

        return Ok(result);
    }
    [Authorize(Roles = "Admin")]
    [HttpPut("reject/{userId}")]
    public async Task<IActionResult> Reject(int userId)
    {
        await _providerService.RejectAsync(userId);

        return NoContent();
    }
    [Authorize(Roles = "Provider")]
    [HttpPut("availability")]
    public async Task<IActionResult> UpdateAvailability(
    UpdateProviderAvailabilityDto dto)
    {
        var userId = int.Parse(
            User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        await _providerService.UpdateAvailabilityAsync(userId, dto);

        return Ok(new
        {
            message = "Availability updated successfully."
        });
    }
    [AllowAnonymous]
    [HttpGet("{providerId}/availability")]
    public async Task<IActionResult> GetAvailability(
    int providerId)
    {
        var result =
            await _providerService.GetAvailabilityAsync(providerId);

        return Ok(result);
    }
    [AllowAnonymous]
    [HttpGet("{providerId}/available-slots")]
    public async Task<IActionResult> GetAvailableSlots(
    int providerId,
    [FromQuery] DateTime date)
    {
        var result =
            await _providerService.GetAvailableSlotsAsync(
                providerId,
                date);

        return Ok(result);
    }
    [Authorize(Roles = "Provider")]
    [HttpGet("my-availability")]
    public async Task<IActionResult> GetMyAvailability()
    {
        var userId = int.Parse(
            User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var result =
            await _providerService.GetAvailabilityAsync(userId);

        return Ok(result);
    }
}