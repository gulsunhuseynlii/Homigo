using Homigo.API.DTOs.Auth;

namespace Homigo.API.Interfaces;

public interface IAuthService
{
    Task RegisterAsync(RegisterDto dto);

    Task<LoginResponseDto> LoginAsync(LoginDto dto);
    Task VerifyEmailAsync(string token);
    Task<ProfileDto> GetProfileAsync(int userId);
    Task<ProfileDto> UpdateProfileAsync(
    int userId,
    UpdateProfileDto dto);
    Task<LoginResponseDto> RefreshTokenAsync(
    string refreshToken);
    Task ChangePasswordAsync(
    int userId,
    ChangePasswordDto dto);
    Task ForgotPasswordAsync(string email);

    Task ResetPasswordAsync(ResetPasswordDto dto);
    Task DeleteMyAccountAsync(int userId);
}