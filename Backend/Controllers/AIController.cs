using System.Collections.Generic;
using System.Threading.Tasks;
using EcommerceAI.DTOs;
using EcommerceAI.Services;
using Microsoft.AspNetCore.Mvc;

namespace EcommerceAI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AIController(IAIService aiService) : ControllerBase
{
    [HttpPost("generate-description")]
    public async Task<ActionResult<GenerateDescriptionResponseDTO>> GenerateDescription([FromBody] GenerateDescriptionRequestDTO dto)
    {
        var description = await aiService.GenerateProductDescriptionAsync(dto);
        return Ok(new GenerateDescriptionResponseDTO { Description = description });
    }

    [HttpGet("reviews-summary/{productId:int}")]
    public async Task<ActionResult<ReviewSummaryResponseDTO>> SummarizeReviews(int productId)
    {
        return Ok(await aiService.SummarizeReviewsAsync(productId));
    }

    [HttpPost("smart-search")]
    public async Task<ActionResult<IEnumerable<SmartSearchResponseDTO>>> SmartSearch([FromBody] SmartSearchRequestDTO dto)
    {
        return Ok(await aiService.SmartSearchAsync(dto.Query));
    }

    [HttpGet("recommendations/{productId:int}")]
    public async Task<ActionResult<IEnumerable<RecommendationResponseDTO>>> GetRecommendations(int productId)
    {
        return Ok(await aiService.GetRecommendationsAsync(productId));
    }
}
