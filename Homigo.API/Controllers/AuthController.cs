using Homigo.API.DTOs.Auth;
using Homigo.API.Interfaces;
using Homigo.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace Homigo.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }
    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterDto dto)
    {
        await _authService.RegisterAsync(dto);

        return Ok("User registered successfully.");
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto dto)
    {
        var result = await _authService.LoginAsync(dto);

        return Ok(result);
    }
    [HttpGet("verify-email")]
    public async Task<IActionResult> VerifyEmail(string token)
    {
        await _authService.VerifyEmailAsync(token);

        return Ok(new
        {
            message = "Email verified successfully."
        });
    }


}