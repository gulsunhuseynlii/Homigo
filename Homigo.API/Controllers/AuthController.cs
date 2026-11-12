using Homigo.API.DTOs.Auth;
using Homigo.API.Interfaces;
using Homigo.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

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
    [HttpPost("refresh")]
    public async Task<IActionResult> RefreshToken(
    RefreshTokenDto dto)
    {
        var result =
            await _authService.RefreshTokenAsync(
                dto.RefreshToken);

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
    [Authorize]
    [HttpGet("profile")]
    public async Task<IActionResult> GetProfile()
    {
        var userId = int.Parse(
            User.FindFirstValue(
                ClaimTypes.NameIdentifier)!
        );

        var profile =
            await _authService.GetProfileAsync(userId);

        return Ok(profile);
    }

    [Authorize]
    [HttpPut("profile")]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> UpdateProfile(
    [FromForm] UpdateProfileDto dto)
    {
        var userId = int.Parse(
            User.FindFirstValue(
                ClaimTypes.NameIdentifier)!);

        var profile =
            await _authService.UpdateProfileAsync(
                userId,
                dto);

        return Ok(profile);
    }
    [Authorize]
    [HttpPut("change-password")]
    public async Task<IActionResult> ChangePassword(
       ChangePasswordDto dto)
    {
        var userId = int.Parse(
            User.FindFirstValue(
                ClaimTypes.NameIdentifier)!);

        await _authService.ChangePasswordAsync(
            userId,
            dto);

        return Ok(new
        {
            message = "Password changed successfully."
        });
    }
    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword(
    ForgotPasswordDto dto)
    {
        await _authService.ForgotPasswordAsync(
            dto.Email);

        return Ok(new
        {
            message =
                "If an account with this email exists, " +
                "a password reset link has been sent."
        });
    }
    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword(
    ResetPasswordDto dto)
    {
        await _authService.ResetPasswordAsync(dto);

        return Ok(new
        {
            message = "Password reset successfully."
        });
    }
    [Authorize]
    [HttpDelete("me")]
    public async Task<IActionResult> DeleteMyAccount()
    {
        var userId = int.Parse(
            User.FindFirstValue(
                ClaimTypes.NameIdentifier)!);

        await _authService.DeleteMyAccountAsync(userId);

        return Ok(new
        {
            message = "Account deleted successfully."
        });
    }
}