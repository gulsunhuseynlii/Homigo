using Homigo.API.Configurations;
using Homigo.API.DTOs.Auth;
using Homigo.API.Entities;
using Homigo.API.Exceptions;
using Homigo.API.Interfaces;
using Homigo.API.Repositories.Interfaces;
using Microsoft.AspNetCore.Identity;
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
    private readonly IFileService _fileService;
    private readonly IPasswordHasher<User> _passwordHasher;
    public AuthService(
    IUserRepository userRepository,
    IOptions<JwtSettings> jwtOptions,
    ILogger<AuthService> logger,
    IEmailService emailService,
    IFileService fileService,
    IPasswordHasher<User> passwordHasher)
    {
        _userRepository = userRepository;
        _jwtSettings = jwtOptions.Value;
        _logger = logger;
        _emailService = emailService;
        _passwordHasher = passwordHasher;
        _fileService = fileService;
    }

    public async Task RegisterAsync(RegisterDto dto)
    {
        _logger.LogInformation(
            "Registration attempt for email: {Email}",
            dto.Email);

        var existingUser =
            await _userRepository.GetByEmailAsync(dto.Email);

        // Email mövcuddur və account silinməyibsə
        if (existingUser != null && !existingUser.IsDeleted)
        {
            _logger.LogWarning(
                "Registration failed. Email already exists: {Email}",
                dto.Email);

            throw new BadRequestException(
                "Email already exists.");
        }

        var customerRole =
            await _userRepository.GetCustomerRoleAsync();

        if (customerRole == null)
        {
            _logger.LogError("Customer role not found.");

            throw new NotFoundException(
                "Customer role not found.");
        }

        // Əvvəlki account silinibsə, onu yenidən aktivləşdir
        if (existingUser != null && existingUser.IsDeleted)
        {
            existingUser.FullName = dto.FullName;
            existingUser.Email = dto.Email;
            existingUser.PhoneNumber = dto.PhoneNumber;

            existingUser.PasswordHash =
                BCrypt.Net.BCrypt.HashPassword(dto.Password);

            existingUser.IsDeleted = false;
            existingUser.IsActive = true;
            existingUser.IsEmailConfirmed = false;

            existingUser.RefreshToken = null;
            existingUser.RefreshTokenExpiryTime = null;
            existingUser.ProfileImageUrl = null;

            await _userRepository.UpdateAsync(existingUser);
            await _userRepository.SaveChangesAsync();

            var verificationToken = new EmailVerificationToken
            {
                UserId = existingUser.Id,
                Token = Guid.NewGuid().ToString(),
                ExpireDate = DateTime.UtcNow.AddHours(24)
            };

            await _userRepository.AddVerificationTokenAsync(
                verificationToken);

            await _userRepository.SaveChangesAsync();

            var verifyUrl =
                $"https://localhost:7121/api/Auth/verify-email?token={verificationToken.Token}";

            await _emailService.SendEmailAsync(
                existingUser.Email,
                "Verify your Homigo account",
                $"""
            <h2>Welcome back to Homigo!</h2>

            <p>Please verify your email by clicking the link below.</p>

            <a href="{verifyUrl}">Verify Email</a>
            """);

            _logger.LogInformation(
                "Deleted account re-registered successfully. UserId: {UserId}",
                existingUser.Id);

            return;
        }

        // Tamamilə yeni user
        var user = new User
        {
            FullName = dto.FullName,
            Email = dto.Email,
            PhoneNumber = dto.PhoneNumber,
            PasswordHash =
                BCrypt.Net.BCrypt.HashPassword(dto.Password),
            RoleId = customerRole.Id
        };

        await _userRepository.AddAsync(user);
        await _userRepository.SaveChangesAsync();

        var newVerificationToken = new EmailVerificationToken
        {
            UserId = user.Id,
            Token = Guid.NewGuid().ToString(),
            ExpireDate = DateTime.UtcNow.AddHours(24)
        };

        await _userRepository.AddVerificationTokenAsync(
            newVerificationToken);

        await _userRepository.SaveChangesAsync();

        var newVerifyUrl =
            $"https://localhost:7121/api/Auth/verify-email?token={newVerificationToken.Token}";

        await _emailService.SendEmailAsync(
            user.Email,
            "Verify your Homigo account",
            $"""
        <h2>Welcome to Homigo!</h2>

        <p>Please verify your email by clicking the link below.</p>

        <a href="{newVerifyUrl}">Verify Email</a>
        """);

        _logger.LogInformation(
            "User registered successfully. UserId: {UserId}",
            user.Id);
    }

    public async Task<LoginResponseDto> LoginAsync(LoginDto dto)
    {
        _logger.LogInformation(
            "Login attempt for email: {Email}",
            dto.Email);

        var user =
            await _userRepository.GetByEmailWithRoleAsync(dto.Email);

        if (user == null)
        {
            _logger.LogWarning(
                "Login failed. User not found: {Email}",
                dto.Email);

            throw new UnauthorizedException(
                "Email or password is incorrect.");
        }

        // Deleted və inactive account login edə bilməz
        if (user.IsDeleted || !user.IsActive)
        {
            _logger.LogWarning(
                "Login failed. Account is deleted or inactive. UserId: {UserId}",
                user.Id);

            throw new UnauthorizedException(
                "This account has been deleted or is inactive.");
        }

        bool isPasswordCorrect =
            BCrypt.Net.BCrypt.Verify(
                dto.Password,
                user.PasswordHash);

        if (!isPasswordCorrect)
        {
            _logger.LogWarning(
                "Login failed. Wrong password for email: {Email}",
                dto.Email);

            throw new UnauthorizedException(
                "Email or password is incorrect.");
        }

        if (!user.IsEmailConfirmed)
        {
            throw new BadRequestException(
                "Please verify your email first.");
        }

        var claims = new List<Claim>
    {
        new Claim(
            ClaimTypes.NameIdentifier,
            user.Id.ToString()),

        new Claim(
            ClaimTypes.Name,
            user.FullName),

        new Claim(
            ClaimTypes.Email,
            user.Email),

        new Claim(
            ClaimTypes.Role,
            user.Role.Name)
    };

        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(
                _jwtSettings.Key));

        var credentials = new SigningCredentials(
            key,
            SecurityAlgorithms.HmacSha256);

        var expiration =
            DateTime.UtcNow.AddMinutes(
                _jwtSettings.ExpireMinutes);

        var token = new JwtSecurityToken(
            issuer: _jwtSettings.Issuer,
            audience: _jwtSettings.Audience,
            claims: claims,
            expires: expiration,
            signingCredentials: credentials);

        var refreshToken = GenerateRefreshToken();

        var refreshTokenExpiration =
            DateTime.UtcNow.AddDays(
                _jwtSettings.RefreshTokenExpireDays);

        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiryTime =
            refreshTokenExpiration;

        await _userRepository.UpdateUserAsync(user);
        await _userRepository.SaveChangesAsync();

        _logger.LogInformation(
            "User logged in successfully. UserId: {UserId}, Role: {Role}",
            user.Id,
            user.Role.Name);

        return new LoginResponseDto
        {
            Token =
                new JwtSecurityTokenHandler()
                    .WriteToken(token),

            Expiration = expiration,

            RefreshToken = refreshToken,

            RefreshTokenExpiration =
                refreshTokenExpiration
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
    public async Task<ProfileDto> GetProfileAsync(int userId)
    {
        var user = await _userRepository.GetUserWithRoleAsync(userId);

        if (user == null)
            throw new NotFoundException("User not found.");


        return new ProfileDto
        {
            Id = user.Id,
            FullName = user.FullName,
            Email = user.Email,
            PhoneNumber = user.PhoneNumber,
            ProfileImageUrl = user.ProfileImageUrl,
            Role = user.Role.Name
        };
    }
    public async Task<ProfileDto> UpdateProfileAsync(
    int userId,
    UpdateProfileDto dto)
    {
        var user =
            await _userRepository.GetUserWithRoleAsync(userId);

        if (user == null)
            throw new NotFoundException("User not found.");


        var existingUser =
            await _userRepository.GetByEmailAsync(dto.Email);

        if (existingUser != null &&
            existingUser.Id != userId)
        {
            throw new BadRequestException(
                "Email already exists.");
        }


        user.FullName = dto.FullName;
        user.Email = dto.Email;
        user.PhoneNumber = dto.PhoneNumber;


        if (dto.ProfileImage != null)
        {
            var imageUrl =
                await _fileService.UploadAsync(
                    dto.ProfileImage,
                    "profiles",
                    ".jpg",
                    ".jpeg",
                    ".png");

            user.ProfileImageUrl = imageUrl;
        }


        await _userRepository.UpdateUserAsync(user);
        await _userRepository.SaveChangesAsync();


        return new ProfileDto
        {
            Id = user.Id,
            FullName = user.FullName,
            Email = user.Email,
            PhoneNumber = user.PhoneNumber,
            ProfileImageUrl = user.ProfileImageUrl,
            Role = user.Role.Name
        };
    }
    public async Task<LoginResponseDto> RefreshTokenAsync(
    string refreshToken)
    {
        if (string.IsNullOrWhiteSpace(refreshToken))
        {
            throw new UnauthorizedException(
                "Refresh token is required.");
        }

        var user =
            await _userRepository
                .GetByRefreshTokenAsync(refreshToken);

        if (user == null)
        {
            throw new UnauthorizedException(
                "Invalid refresh token.");
        }

        if (user.RefreshTokenExpiryTime == null ||
            user.RefreshTokenExpiryTime <= DateTime.UtcNow)
        {
            throw new UnauthorizedException(
                "Refresh token expired.");
        }

        if (!user.IsActive || user.IsDeleted)
        {
            throw new UnauthorizedException(
                "User account is inactive.");
        }

        var claims = new List<Claim>
    {
        new Claim(
            ClaimTypes.NameIdentifier,
            user.Id.ToString()),

        new Claim(
            ClaimTypes.Name,
            user.FullName),

        new Claim(
            ClaimTypes.Email,
            user.Email),

        new Claim(
            ClaimTypes.Role,
            user.Role.Name)
    };

        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(
                _jwtSettings.Key));

        var credentials = new SigningCredentials(
            key,
            SecurityAlgorithms.HmacSha256);

        var expiration =
            DateTime.UtcNow.AddMinutes(
                _jwtSettings.ExpireMinutes);

        var token = new JwtSecurityToken(
            issuer: _jwtSettings.Issuer,
            audience: _jwtSettings.Audience,
            claims: claims,
            expires: expiration,
            signingCredentials: credentials);

        // Rotate refresh token
        var newRefreshToken =
            GenerateRefreshToken();

        var newRefreshTokenExpiration =
            DateTime.UtcNow.AddDays(
                _jwtSettings.RefreshTokenExpireDays);

        user.RefreshToken = newRefreshToken;

        user.RefreshTokenExpiryTime =
            newRefreshTokenExpiration;

        await _userRepository.UpdateUserAsync(user);
        await _userRepository.SaveChangesAsync();

        return new LoginResponseDto
        {
            Token =
                new JwtSecurityTokenHandler()
                    .WriteToken(token),

            Expiration = expiration,

            RefreshToken = newRefreshToken,

            RefreshTokenExpiration =
                newRefreshTokenExpiration
        };
    }
    private string GenerateRefreshToken()
    {
        return Convert.ToBase64String(
            System.Security.Cryptography.RandomNumberGenerator
                .GetBytes(64)
        );
    }
    public async Task ForgotPasswordAsync(
    string email)
    {
        var user =
            await _userRepository.GetByEmailAsync(email);

        // Security səbəbilə email mövcud deyil deyə
        // frontend-ə məlumat vermirik.
        if (user == null)
        {
            return;
        }

        var resetToken = new EmailVerificationToken
        {
            UserId = user.Id,
            Token = Guid.NewGuid().ToString(),
            ExpireDate = DateTime.UtcNow.AddMinutes(30),
            IsUsed = false
        };

        await _userRepository.AddVerificationTokenAsync(
            resetToken);

        await _userRepository.SaveChangesAsync();

        var resetUrl =
            $"http://localhost:5173/reset-password?token={resetToken.Token}";

        await _emailService.SendPasswordResetEmailAsync(
            user.Email,
            user.FullName,
            resetUrl);
    }
    public async Task ResetPasswordAsync(
    ResetPasswordDto dto)
    {
        var verification =
            await _userRepository.GetVerificationTokenAsync(
                dto.Token);

        if (verification == null)
        {
            throw new BadRequestException(
                "Invalid or expired reset token.");
        }

        if (verification.IsUsed)
        {
            throw new BadRequestException(
                "This reset link has already been used.");
        }

        if (verification.ExpireDate < DateTime.UtcNow)
        {
            throw new BadRequestException(
                "This reset link has expired.");
        }

        var user = verification.User;

        if (user == null)
        {
            throw new NotFoundException(
                "User not found.");
        }

        user.PasswordHash =
            BCrypt.Net.BCrypt.HashPassword(
                dto.NewPassword);

        verification.IsUsed = true;

        await _userRepository.UpdateUserAsync(user);
        await _userRepository.SaveChangesAsync();
    }
    public async Task ChangePasswordAsync(
     int userId,
     ChangePasswordDto dto)
    {
        var user = await _userRepository.GetByIdAsync(userId);

        if (user == null)
        {
            throw new Exception("User not found.");
        }

        var isCurrentPasswordCorrect =
            BCrypt.Net.BCrypt.Verify(
                dto.CurrentPassword,
                user.PasswordHash);

        if (!isCurrentPasswordCorrect)
        {
            throw new Exception("Current password is incorrect.");
        }

        user.PasswordHash =
            BCrypt.Net.BCrypt.HashPassword(
                dto.NewPassword);

        await _userRepository.UpdateAsync(user);
        await _userRepository.SaveChangesAsync();
    }
    public async Task DeleteMyAccountAsync(int userId)
    {
        var user = await _userRepository.GetByIdAsync(userId);

        if (user == null)
        {
            throw new NotFoundException("User not found.");
        }

        user.IsDeleted = true;
        user.IsActive = false;
        user.RefreshToken = null;
        user.RefreshTokenExpiryTime = null;

        await _userRepository.UpdateAsync(user);
        await _userRepository.SaveChangesAsync();

        _logger.LogInformation(
            "User account deleted. UserId: {UserId}",
            userId);
    }
}