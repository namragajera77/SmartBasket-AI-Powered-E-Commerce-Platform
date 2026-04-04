using System.ComponentModel.DataAnnotations;

namespace EcommerceAI.DTOs;

public class DevResetPasswordRequestDTO
{
    [Required]
    [EmailAddress]
    [MaxLength(256)]
    public string Email { get; set; } = string.Empty;

    [Required]
    [MinLength(6)]
    [MaxLength(128)]
    public string NewPassword { get; set; } = string.Empty;
}
