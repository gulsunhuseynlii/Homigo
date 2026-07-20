using Homigo.API.Configurations;
using Homigo.API.DTOs.Auth;
using Homigo.API.Entities;
using Homigo.API.Exceptions;
using Homigo.API.Interfaces;
using Homigo.API.Repositories.Interfaces;
using Microsoft.Extensions.Logging;
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
    private readonly ILogger<AuthService> _logger;
    private readonly IEmailService _emailService;

    public AuthService(
     IUserRepository userRepository,
     IOptions<JwtSettings> jwtOptions,
     ILogger<AuthService> logger,
     IEmailService emailService)
    {
        _userRepository = userRepository;
        _jwtSettings = jwtOptions.Value;
        _logger = logger;
        _emailService = emailService;
    }

    public async Task RegisterAsync(RegisterDto dto)
    {
        _logger.LogInformation(
            "Registration attempt for email: {Email}",
            dto.Email);

        var existingUser = await _userRepository.GetByEmailAsync(dto.Email);

        if (existingUser != null)
        {
            _logger.LogWarning(
                "Registration failed. Email already exists: {Email}",
                dto.Email);

            throw new BadRequestException("Email already exists.");
        }

        var customerRole = await _userRepository.GetCustomerRoleAsync();

        if (customerRole == null)
        {
            _logger.LogError("Customer role not found.");

            throw new NotFoundException("Customer role not found.");
        }

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
        var verificationToken = new EmailVerificationToken
        {
            UserId = user.Id,
            Token = Guid.NewGuid().ToString(),
            ExpireDate = DateTime.UtcNow.AddHours(24)
        };

        await _userRepository.AddVerificationTokenAsync(verificationToken);
        await _userRepository.SaveChangesAsync();

        var verifyUrl =
            $"https://localhost:7121/api/Auth/verify-email?token={verificationToken.Token}";

        await _emailService.SendEmailAsync(
            user.Email,
            "Verify your Homigo account",
            $"""
    <h2>Welcome to Homigo!</h2>

    <p>Please verify your email by clicking the link below.</p>

    <a href="{verifyUrl}">Verify Email</a>
    """);

        _logger.LogInformation(
    "User registered successfully. UserId: {UserId}",
    user.Id);
        _logger.LogInformation(
    "Verification email sent to {Email}",
    user.Email);

    }

    public async Task<LoginResponseDto> LoginAsync(LoginDto dto)
    {
        _logger.LogInformation(
            "Login attempt for email: {Email}",
            dto.Email);

        var user = await _userRepository.GetByEmailWithRoleAsync(dto.Email);

        if (user == null)
        {
            _logger.LogWarning(
                "Login failed. User not found: {Email}",
                dto.Email);

            throw new UnauthorizedException("Email or password is incorrect.");
        }

        bool isPasswordCorrect =
            BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash);

        if (!isPasswordCorrect)
        {
            _logger.LogWarning(
                "Login failed. Wrong password for email: {Email}",
                dto.Email);

            throw new UnauthorizedException("Email or password is incorrect.");
        }
        if (!user.IsEmailConfirmed)
            throw new BadRequestException("Please verify your email first.");

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

        _logger.LogInformation(
            "User logged in successfully. UserId: {UserId}, Role: {Role}",
            user.Id,
            user.Role.Name);

        return new LoginResponseDto
        {
            Token = new JwtSecurityTokenHandler().WriteToken(token),
            Expiration = expiration
        };

    }
    public async Task VerifyEmailAsync(string token)
    {
        var verification =
            await _userRepository.GetVerificationTokenAsync(token);

        if (verification == null)
            throw new NotFoundException("Invalid verification token.");

        if (verification.ExpireDate < DateTime.UtcNow)
            throw new BadRequestException("Verification token expired.");

        verification.IsUsed = true;

        verification.User.IsEmailConfirmed = true;

        await _userRepository.UpdateUserAsync(verification.User);

        await _userRepository.SaveChangesAsync();
        _logger.LogInformation(
    "Email verified successfully for user {UserId}",
    verification.UserId);
    }
}