using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using EcommerceAI.DTOs;
using EcommerceAI.Repositories;
using EcommerceAI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EcommerceAI.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class OrdersController(IOrderService orderService) : ControllerBase
{
    [HttpPost("checkout")]
    public async Task<ActionResult<OrderResponseDTO>> Checkout([FromBody] CheckoutRequestDTO dto)
    {
        return Ok(await orderService.CheckoutAsync(GetUserId(), dto));
    }

    [HttpGet("my")]
    public async Task<ActionResult<IEnumerable<OrderResponseDTO>>> GetMyOrders()
    {
        return Ok(await orderService.GetUserOrdersAsync(GetUserId()));
    }

    [HttpGet("my/{id:int}")]
    public async Task<ActionResult<OrderResponseDTO>> GetMyOrderById(int id)
    {
        var order = await orderService.GetOrderAsync(id);
        if (order is null)
        {
            return NotFound();
        }

        return Ok(order);
    }

    [Authorize(Roles = "Admin")]
    [HttpGet]
    public async Task<ActionResult<IEnumerable<OrderResponseDTO>>> GetAllOrders()
    {
        return Ok(await orderService.GetAllOrdersAsync());
    }

    [Authorize(Roles = "Admin")]
    [HttpPost("{orderId:int}/assign-delivery")]
    public async Task<IActionResult> AssignDelivery(int orderId, [FromBody] AssignDeliveryDTO dto)
    {
        await orderService.AssignDeliveryAsync(orderId, dto.DeliveryBoyId);
        return NoContent();
    }

    [HttpPost("{orderId:int}/reject")]
    public async Task<IActionResult> RejectOrder(int orderId, [FromBody] RejectOrderDTO dto)
    {
        await orderService.RejectOrderByCustomerAsync(GetUserId(), orderId, dto.Reason);
        return NoContent();
    }

    [Authorize(Roles = "Admin")]
    [HttpPost("{orderId:int}/reject-admin")]
    public async Task<IActionResult> RejectOrderByAdmin(int orderId, [FromBody] RejectOrderDTO dto)
    {
        await orderService.RejectOrderByAdminAsync(orderId, dto.Reason);
        return NoContent();
    }

    [Authorize(Roles = "Admin")]
    [HttpGet("delivery-users")]
    public async Task<ActionResult<IEnumerable<object>>> GetDeliveryUsers([FromServices] IUserRepository userRepository)
    {
        var users = await userRepository.GetByRoleAsync("Delivery");
        var response = users.Select(user => new
        {
            id = user.Id,
            fullName = $"{user.FirstName} {user.LastName}".Trim(),
            email = user.Email
        });

        return Ok(response);
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
