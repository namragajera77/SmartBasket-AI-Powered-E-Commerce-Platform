using System;
using System.Linq;
using System.Security.Cryptography;
using System.Threading.Tasks;
using EcommerceAI.DTOs;
using EcommerceAI.Helpers;
using EcommerceAI.Models;
using EcommerceAI.Repositories;
using Microsoft.Extensions.Logging;

namespace EcommerceAI.Services;

public class AuthService(
    IUserRepository userRepository,
    IRefreshTokenRepository refreshTokenRepository,
    IJwtTokenGenerator jwtTokenGenerator,
    ILogger<AuthService> logger) : IAuthService
{
    public async Task<AuthResponseDTO> RegisterAsync(RegisterRequestDTO request)
    {
        var email = request.Email.Trim().ToLowerInvariant();
        if (await userRepository.EmailExistsAsync(email))
        {
            throw new InvalidOperationException("Email already registered.");
        }

        var user = new User
        {
            FirstName = request.FirstName.Trim(),
            LastName = request.LastName.Trim(),
            Email = email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            PhoneNumber = request.PhoneNumber,
            Role = "Customer"
        };

        await userRepository.AddUserAsync(user);
        return await CreateAuthResponseAsync(user);
    }

    public async Task<AuthResponseDTO> LoginAsync(LoginRequestDTO request)
    {
        var email = request.Email.Trim().ToLowerInvariant();
        var user = await userRepository.GetByEmailAsync(email)
            ?? throw new UnauthorizedAccessException("Invalid email or password.");

        var password = request.Password ?? string.Empty;
        var isBcryptHash = user.PasswordHash.StartsWith("$2", StringComparison.Ordinal);
        var isValidPassword = isBcryptHash
            ? BCrypt.Net.BCrypt.Verify(password, user.PasswordHash)
            : string.Equals(password, user.PasswordHash, StringComparison.Ordinal);

        if (!isValidPassword)
        {
            throw new UnauthorizedAccessException("Invalid email or password.");
        }

        if (!isBcryptHash)
        {
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(password);
            await userRepository.UpdateUserAsync(user);
            logger.LogInformation("Upgraded legacy password hash for user {UserId}", user.Id);
        }

        return await CreateAuthResponseAsync(user);
    }

    public async Task<AuthResponseDTO> RefreshTokenAsync(RefreshTokenRequestDTO request)
    {
        var tokenHash = HashToken(request.RefreshToken);
        var token = await refreshTokenRepository.GetByTokenHashAsync(tokenHash)
            ?? throw new UnauthorizedAccessException("Invalid refresh token.");

        if (token.RevokedAtUtc.HasValue || token.ExpiresAtUtc <= DateTime.UtcNow)
        {
            throw new UnauthorizedAccessException("Refresh token is expired or revoked.");
        }

        token.RevokedAtUtc = DateTime.UtcNow;
        var user = token.User;

        var newRawToken = GenerateRefreshToken();
        var newRefreshToken = new RefreshToken
        {
            UserId = user.Id,
            TokenHash = HashToken(newRawToken),
            ExpiresAtUtc = DateTime.UtcNow.AddDays(7),
            ReplacedByTokenHash = null
        };

        token.ReplacedByTokenHash = newRefreshToken.TokenHash;
        await refreshTokenRepository.AddAsync(newRefreshToken);
        await refreshTokenRepository.SaveChangesAsync();

        logger.LogInformation("Refresh token rotated for user {UserId}", user.Id);

        return new AuthResponseDTO
        {
            Token = jwtTokenGenerator.GenerateToken(user),
            RefreshToken = newRawToken,
            RefreshTokenExpiresAtUtc = newRefreshToken.ExpiresAtUtc,
            Email = user.Email,
            Role = user.Role
        };
    }

    public async Task ResetPasswordAsync(string email, string newPassword)
    {
        var normalizedEmail = email.Trim().ToLowerInvariant();
        var user = await userRepository.GetByEmailAsync(normalizedEmail)
            ?? throw new KeyNotFoundException("User not found.");

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(newPassword);
        await userRepository.UpdateUserAsync(user);
        logger.LogInformation("Password reset for user {UserId}", user.Id);
    }

    private async Task<AuthResponseDTO> CreateAuthResponseAsync(User user)
    {
        var rawRefreshToken = GenerateRefreshToken();
        var refreshToken = new RefreshToken
        {
            UserId = user.Id,
            TokenHash = HashToken(rawRefreshToken),
            ExpiresAtUtc = DateTime.UtcNow.AddDays(7)
        };

        await refreshTokenRepository.AddAsync(refreshToken);
        await refreshTokenRepository.SaveChangesAsync();

        return new AuthResponseDTO
        {
            Token = jwtTokenGenerator.GenerateToken(user),
            RefreshToken = rawRefreshToken,
            RefreshTokenExpiresAtUtc = refreshToken.ExpiresAtUtc,
            Email = user.Email,
            Role = user.Role
        };
    }

    private static string GenerateRefreshToken()
    {
        return Convert.ToBase64String(RandomNumberGenerator.GetBytes(64));
    }

    private static string HashToken(string token)
    {
        var bytes = SHA256.HashData(System.Text.Encoding.UTF8.GetBytes(token));
        return Convert.ToHexString(bytes);
    }
}
