using Homigo.API.DTOs.Auth;

namespace Homigo.API.Interfaces;

public interface IAuthService
{
    Task RegisterAsync(RegisterDto dto);

    Task<LoginResponseDto> LoginAsync(LoginDto dto);
    Task VerifyEmailAsync(string token);
}