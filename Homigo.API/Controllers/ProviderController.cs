using Homigo.API.DTOs.Provider;
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
    public async Task<IActionResult> Apply(ApplyProviderDto dto)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        await _providerService.ApplyAsync(userId, dto);

        return Ok(new
        {
            message = "Your provider application has been submitted successfully."
        });
    }
    [Authorize(Roles = "Admin")]
    [HttpGet("pending")]
    public async Task<IActionResult> GetPending()
    {
        var result = await _providerService.GetPendingApplicationsAsync();

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

}