using System;
using System.ComponentModel.DataAnnotations;

namespace EcommerceAI.Models;

public class RefreshToken
{
    public int Id { get; set; }

    public int UserId { get; set; }

    [Required]
    [MaxLength(128)]
    public string TokenHash { get; set; } = string.Empty;

    public DateTime ExpiresAtUtc { get; set; }

    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;

    public DateTime? RevokedAtUtc { get; set; }

    [MaxLength(128)]
    public string? ReplacedByTokenHash { get; set; }

    public User User { get; set; } = null;
}
