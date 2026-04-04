using System.ComponentModel.DataAnnotations;

namespace EcommerceAI.DTOs;

public class RejectOrderDTO
{
    [Required]
    [MaxLength(500)]
    public string Reason { get; set; } = string.Empty;
}