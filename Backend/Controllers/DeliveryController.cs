using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using EcommerceAI.DTOs;
using EcommerceAI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EcommerceAI.Controllers;

[ApiController]
[Authorize(Roles = "Delivery")]
[Route("api/[controller]")]
public class DeliveryController(IOrderService orderService) : ControllerBase
{
    [HttpGet("orders")]
    public async Task<ActionResult<IEnumerable<OrderResponseDTO>>> GetAssignedOrders()
    {
        return Ok(await orderService.GetDeliveryOrdersAsync(GetUserId()));
    }

    [HttpPost("orders/{orderId:int}/status/{status}")]
    public async Task<IActionResult> UpdateStatus(int orderId, string status)
    {
        await orderService.UpdateDeliveryStatusAsync(GetUserId(), orderId, status);
        return NoContent();
    }

    [HttpPost("orders/{orderId:int}/verify-otp")]
    public async Task<IActionResult> VerifyOtp(int orderId, [FromBody] VerifyOtpDTO dto)
    {
        await orderService.VerifyDeliveryOtpAsync(GetUserId(), orderId, dto.OTP);
        return NoContent();
    }

    [HttpPost("orders/{orderId:int}/reject")]
    public async Task<IActionResult> RejectOrder(int orderId, [FromBody] RejectOrderDTO dto)
    {
        await orderService.RejectOrderByDeliveryAsync(GetUserId(), orderId, dto.Reason);
        return NoContent();
    }

    private int GetUserId()
    {
        var claim = User.FindFirstValue("UserId") ?? User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!int.TryParse(claim, out var userId))
        {
            throw new UnauthorizedAccessException("User id claim is missing or invalid.");
        }

        return userId;
    }
}
