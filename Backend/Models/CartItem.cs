using System;
using System.ComponentModel.DataAnnotations;

namespace EcommerceAI.Models;

public class CartItem
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public int ProductId { get; set; }

    [Range(1, int.MaxValue)]
    public int Quantity { get; set; } = 1;

    public DateTime AddedAtUtc { get; set; } = DateTime.UtcNow;

    public User User { get; set; } = null;

    public Product Product { get; set; } = null;
}
