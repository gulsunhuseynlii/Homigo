using System.Security.Claims;
using Homigo.API.DTOs.Service;
using Homigo.API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Homigo.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ServiceController : ControllerBase
{
    private readonly IServiceService _serviceService;

    public ServiceController(IServiceService serviceService)
    {
        _serviceService = serviceService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] ServiceQueryDto query)
    {
        var result = await _serviceService.GetAllAsync(query);

        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var service = await _serviceService.GetByIdAsync(id);

        if (service == null)
            return NotFound();

        return Ok(service);
    }

    [Authorize(Roles = "Admin,Provider")]
    [HttpPost]
    public async Task<IActionResult> Create([FromForm] CreateServiceDto dto)
    {
        var userId = int.Parse(
            User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var service = await _serviceService.CreateAsync(userId, dto);

        return CreatedAtAction(
            nameof(GetById),
            new { id = service.Id },
            service);
    }

    [Authorize(Roles = "Admin,Provider")]
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(
        int id,
        [FromForm] UpdateServiceDto dto)
    {
        var userId = int.Parse(
            User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        await _serviceService.UpdateAsync(
            userId,
            id,
            dto);

        return NoContent();
    }

    [Authorize(Roles = "Admin,Provider")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var userId = int.Parse(
            User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        await _serviceService.DeleteAsync(
            userId,
            id);

        return NoContent();
    }
    [Authorize(Roles = "Provider")]
    [HttpGet("my")]
    public async Task<IActionResult> GetMyServices()
    {
        var userId = int.Parse(
            User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var services =
            await _serviceService.GetMyServicesAsync(userId);

        return Ok(services);
    }
}