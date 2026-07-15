using Homigo.API.Configurations;
using Homigo.API.DTOs.Auth;
using Homigo.API.Entities;
using Homigo.API.Interfaces;
using Homigo.API.Repositories.Interfaces;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Homigo.API.Services;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly JwtSettings _jwtSettings;

    public AuthService(
        IUserRepository userRepository,
        IOptions<JwtSettings> jwtOptions)
    {
        _userRepository = userRepository;
        _jwtSettings = jwtOptions.Value;
    }

    public async Task RegisterAsync(RegisterDto dto)
    {
        var existingUser = await _userRepository.GetByEmailAsync(dto.Email);

        if (existingUser != null)
            throw new Exception("Email already exists.");

        var customerRole = await _userRepository.GetCustomerRoleAsync();

        if (customerRole == null)
            throw new Exception("Customer role not found.");

        var user = new User
        {
            FullName = dto.FullName,
            Email = dto.Email,
            PhoneNumber = dto.PhoneNumber,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            RoleId = customerRole.Id
        };

        await _userRepository.AddAsync(user);
        await _userRepository.SaveChangesAsync();
    }

    public async Task<LoginResponseDto> LoginAsync(LoginDto dto)
    {
        var user = await _userRepository.GetByEmailWithRoleAsync(dto.Email);

        if (user == null)
            throw new Exception("Email or password is incorrect.");

        bool isPasswordCorrect =
            BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash);

        if (!isPasswordCorrect)
            throw new Exception("Email or password is incorrect.");

        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.FullName),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Role, user.Role.Name)
        };

        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(_jwtSettings.Key));

        var credentials = new SigningCredentials(
            key,
            SecurityAlgorithms.HmacSha256);

        var expiration =
            DateTime.UtcNow.AddMinutes(_jwtSettings.ExpireMinutes);

        var token = new JwtSecurityToken(
            issuer: _jwtSettings.Issuer,
            audience: _jwtSettings.Audience,
            claims: claims,
            expires: expiration,
            signingCredentials: credentials);

        return new LoginResponseDto
        {
            Token = new JwtSecurityTokenHandler().WriteToken(token),
            Expiration = expiration
        };
    }
}