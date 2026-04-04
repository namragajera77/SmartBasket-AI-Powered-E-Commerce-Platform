using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using EcommerceAI.DTOs;
using EcommerceAI.Models;
using EcommerceAI.Repositories;
using Microsoft.Extensions.Logging;

namespace EcommerceAI.Services;

public class OrderService(
    IOrderRepository orderRepository,
    ICartRepository cartRepository,
    IUserRepository userRepository,
    ILogger<OrderService> logger) : IOrderService
{
    public async Task<OrderResponseDTO> CheckoutAsync(int userId, CheckoutRequestDTO dto)
    {
        var user = await userRepository.GetByIdAsync(userId)
            ?? throw new KeyNotFoundException("User not found.");

        var cartItems = (await cartRepository.GetUserCartAsync(userId)).ToList();
        if (cartItems.Count == 0)
        {
            throw new InvalidOperationException("Cart is empty.");
        }

        var order = new Order
        {
            UserId = userId,
            ShippingAddress = dto.ShippingAddress,
            Status = "Pending",
            OrderedAtUtc = DateTime.UtcNow,
            TotalAmount = cartItems.Sum(ci => ci.Product.Price * ci.Quantity),
            Customer = user,
            OrderItems = cartItems.Select(ci => new OrderItem
            {
                ProductId = ci.ProductId,
                Quantity = ci.Quantity,
                UnitPrice = ci.Product.Price,
                Product = ci.Product
            }).ToList()
        };

        await orderRepository.AddAsync(order);

        foreach (var cartItem in cartItems)
        {
            await cartRepository.RemoveAsync(cartItem);
        }

        var persisted = await orderRepository.GetByIdAsync(order.Id) ?? order;
        return MapOrder(persisted);
    }

    public async Task<IEnumerable<OrderResponseDTO>> GetUserOrdersAsync(int userId)
    {
        var orders = await orderRepository.GetUserOrdersAsync(userId);
        return orders.Select(MapOrder);
    }

    public async Task<OrderResponseDTO?> GetOrderAsync(int id)
    {
        var order = await orderRepository.GetByIdAsync(id);
        return order is null ? null : MapOrder(order);
    }

    public async Task<IEnumerable<OrderResponseDTO>> GetAllOrdersAsync()
    {
        var orders = await orderRepository.GetAllAsync();
        return orders.Select(MapOrder);
    }

    public async Task AssignDeliveryAsync(int orderId, int deliveryBoyId)
    {
        var order = await orderRepository.GetByIdAsync(orderId)
            ?? throw new KeyNotFoundException("Order not found.");

        if (order.Status.StartsWith("Rejected", StringComparison.OrdinalIgnoreCase))
        {
            throw new InvalidOperationException("Rejected order cannot be assigned.");
        }

        if (order.DeliveryBoyId.HasValue ||
            order.Status.Equals("Assigned", StringComparison.OrdinalIgnoreCase) ||
            order.Status.Equals("OutForDelivery", StringComparison.OrdinalIgnoreCase) ||
            order.Status.Equals("Delivered", StringComparison.OrdinalIgnoreCase))
        {
            throw new InvalidOperationException("Delivery is already assigned and cannot be reassigned.");
        }

        order.DeliveryBoyId = deliveryBoyId;
        order.Status = "Assigned";
        order.DeliveryOTP = Random.Shared.Next(100000, 999999).ToString();
        order.OTPGeneratedAt = DateTime.UtcNow;

        await orderRepository.UpdateAsync(order);
    }

    public async Task<IEnumerable<OrderResponseDTO>> GetDeliveryOrdersAsync(int deliveryBoyId)
    {
        var orders = await orderRepository.GetAllAsync();
        return orders.Where(o => o.DeliveryBoyId == deliveryBoyId).Select(MapOrder);
    }

    public async Task UpdateDeliveryStatusAsync(int deliveryBoyId, int orderId, string status)
    {
        var order = await orderRepository.GetByIdAsync(orderId)
            ?? throw new KeyNotFoundException("Order not found.");

        if (order.DeliveryBoyId != deliveryBoyId)
        {
            throw new UnauthorizedAccessException("Order is not assigned to this delivery user.");
        }

        order.Status = status;
        if (status.Equals("OutForDelivery", StringComparison.OrdinalIgnoreCase))
        {
            order.OutForDeliveryAtUtc = DateTime.UtcNow;
        }

        if (status.Equals("Delivered", StringComparison.OrdinalIgnoreCase))
        {
            order.DeliveredAtUtc = DateTime.UtcNow;
        }

        await orderRepository.UpdateAsync(order);
    }

    public async Task VerifyDeliveryOtpAsync(int deliveryBoyId, int orderId, string otp)
    {
        var order = await orderRepository.GetByIdAsync(orderId)
            ?? throw new KeyNotFoundException("Order not found.");

        if (order.DeliveryBoyId != deliveryBoyId)
        {
            throw new UnauthorizedAccessException("Order is not assigned to this delivery user.");
        }

        if (!string.Equals(order.DeliveryOTP, otp, StringComparison.Ordinal))
        {
            throw new InvalidOperationException("Invalid OTP.");
        }

        order.OTPVerified = true;
        order.Status = "Delivered";
        order.DeliveredAtUtc = DateTime.UtcNow;
        await orderRepository.UpdateAsync(order);
    }

    public async Task RejectOrderByDeliveryAsync(int deliveryBoyId, int orderId, string reason)
    {
        var order = await orderRepository.GetByIdAsync(orderId)
            ?? throw new KeyNotFoundException("Order not found.");

        if (order.DeliveryBoyId != deliveryBoyId)
        {
            throw new UnauthorizedAccessException("Order is not assigned to this delivery user.");
        }

        ApplyRejection(order, "RejectedByDelivery", reason);
        logger.LogInformation("Order {OrderId} rejected by delivery user {DeliveryUserId}. Reason: {Reason}", orderId, deliveryBoyId, reason.Trim());
        await orderRepository.UpdateAsync(order);
    }

    public async Task RejectOrderByCustomerAsync(int userId, int orderId, string reason)
    {
        var order = await orderRepository.GetByIdAsync(orderId)
            ?? throw new KeyNotFoundException("Order not found.");

        if (order.UserId != userId)
        {
            throw new UnauthorizedAccessException("You can reject only your own order.");
        }

        ApplyRejection(order, "RejectedByCustomer", reason);
        logger.LogInformation("Order {OrderId} rejected by customer {UserId}. Reason: {Reason}", orderId, userId, reason.Trim());
        await orderRepository.UpdateAsync(order);
    }

    public async Task RejectOrderByAdminAsync(int orderId, string reason)
    {
        var order = await orderRepository.GetByIdAsync(orderId)
            ?? throw new KeyNotFoundException("Order not found.");

        ApplyRejection(order, "RejectedByAdmin", reason);
        logger.LogInformation("Order {OrderId} rejected by admin. Reason: {Reason}", orderId, reason.Trim());
        await orderRepository.UpdateAsync(order);
    }

    private static void ApplyRejection(Order order, string rejectedStatus, string reason)
    {
        if (string.IsNullOrWhiteSpace(reason))
        {
            throw new ArgumentException("Reason is required.");
        }

        if (reason.Trim().Length < 3)
        {
            throw new ArgumentException("Reason must be at least 3 characters.");
        }

        if (order.Status.Equals("Delivered", StringComparison.OrdinalIgnoreCase))
        {
            throw new InvalidOperationException("Delivered order cannot be rejected.");
        }

        if (order.Status.StartsWith("Rejected", StringComparison.OrdinalIgnoreCase))
        {
            throw new InvalidOperationException("Order is already rejected.");
        }

        foreach (var item in order.OrderItems)
        {
            if (item.Product is not null)
            {
                item.Product.StockQuantity += item.Quantity;
            }
        }

        order.DeliveryBoyId = null;
        order.DeliveryOTP = null;
        order.OTPGeneratedAt = null;
        order.OTPVerified = false;
        order.Status = rejectedStatus;
        order.RejectedBy = rejectedStatus;
        order.RejectionReason = reason.Trim();
        order.RejectedAtUtc = DateTime.UtcNow;
    }

    private static OrderResponseDTO MapOrder(Order order)
    {
        return new OrderResponseDTO
        {
            OrderId = order.Id,
            Status = order.Status,
            TotalAmount = order.TotalAmount,
            OrderedAtUtc = order.OrderedAtUtc,
            ShippingAddress = order.ShippingAddress,
            DeliveryBoyId = order.DeliveryBoyId,
            DeliveryOtp = order.DeliveryOTP,
            OtpVerified = order.OTPVerified,
            RejectedBy = order.RejectedBy,
            RejectionReason = order.RejectionReason,
            RejectedAtUtc = order.RejectedAtUtc,
            Items = order.OrderItems.Select(oi => new OrderItemResponseDTO
            {
                ProductId = oi.ProductId,
                ProductName = oi.Product?.Name ?? string.Empty,
                Quantity = oi.Quantity,
                UnitPrice = oi.UnitPrice,
                Subtotal = oi.UnitPrice * oi.Quantity
            }).ToList()
        };
    }
}
