using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace EcommerceAI.Models;

public class Order
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public int? DeliveryBoyId { get; set; }

    [MaxLength(10)]
    public string? DeliveryOTP { get; set; }

    public DateTime? OTPGeneratedAt { get; set; }

    public bool OTPVerified { get; set; }

    [Required]
    [MaxLength(32)]
    public string Status { get; set; } = "Pending";

    [Range(0.0, double.MaxValue)]
    public decimal TotalAmount { get; set; }

    public DateTime? PackedAtUtc { get; set; }

    public DateTime? OutForDeliveryAtUtc { get; set; }

    public DateTime? DeliveredAtUtc { get; set; }

    [MaxLength(32)]
    public string? RejectedBy { get; set; }

    [MaxLength(500)]
    public string? RejectionReason { get; set; }

    public DateTime? RejectedAtUtc { get; set; }

    public DateTime OrderedAtUtc { get; set; } = DateTime.UtcNow;

    [MaxLength(500)]
    public string? ShippingAddress { get; set; }

    public User Customer { get; set; } = null;

    public User? DeliveryBoy { get; set; }

    public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
}
