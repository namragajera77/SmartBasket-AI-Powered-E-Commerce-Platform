using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using EcommerceAI.DTOs;
using EcommerceAI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EcommerceAI.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class CartController(ICartService cartService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<CartItemResponseDTO>>> GetCart()
    {
        return Ok(await cartService.GetCartAsync(GetUserId()));
    }

    [HttpPost]
    public async Task<IActionResult> AddToCart([FromBody] AddToCartDTO dto)
    {
        await cartService.AddToCartAsync(GetUserId(), dto);
        return NoContent();
    }

    [HttpPut("{cartItemId:int}")]
    public async Task<IActionResult> UpdateCartItem(int cartItemId, [FromBody] UpdateCartItemDTO dto)
    {
        await cartService.UpdateCartItemAsync(GetUserId(), cartItemId, dto);
        return NoContent();
    }

    [HttpDelete("{cartItemId:int}")]
    public async Task<IActionResult> RemoveCartItem(int cartItemId)
    {
        await cartService.RemoveCartItemAsync(GetUserId(), cartItemId);
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
