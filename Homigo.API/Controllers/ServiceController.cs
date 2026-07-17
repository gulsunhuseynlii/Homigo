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

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<IActionResult> Create(CreateServiceDto dto)
    {
        var service = await _serviceService.CreateAsync(dto);

        return CreatedAtAction(nameof(GetById), new { id = service.Id }, service);
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, UpdateServiceDto dto)
    {
        await _serviceService.UpdateAsync(id, dto);

        return NoContent();
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _serviceService.DeleteAsync(id);

        return NoContent();
    }
}