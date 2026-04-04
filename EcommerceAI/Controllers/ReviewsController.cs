using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using EcommerceAI.DTOs;
using EcommerceAI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EcommerceAI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReviewsController(IReviewService reviewService) : ControllerBase
{
    [HttpGet("product/{productId:int}")]
    public async Task<ActionResult<IEnumerable<ReviewResponseDTO>>> GetProductReviews(int productId)
    {
        return Ok(await reviewService.GetProductReviewsAsync(productId));
    }

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> CreateReview([FromBody] CreateReviewDTO dto)
    {
        await reviewService.CreateReviewAsync(GetUserId(), dto);
        return NoContent();
    }

    [Authorize]
    [HttpPut("{reviewId:int}")]
    public async Task<IActionResult> UpdateReview(int reviewId, [FromBody] UpdateReviewDTO dto)
    {
        await reviewService.UpdateReviewAsync(GetUserId(), reviewId, dto);
        return NoContent();
    }

    [Authorize]
    [HttpDelete("{reviewId:int}")]
    public async Task<IActionResult> DeleteReview(int reviewId)
    {
        await reviewService.DeleteReviewAsync(GetUserId(), reviewId);
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
