using System.Collections.Generic;
using System.Threading.Tasks;
using EcommerceAI.DTOs;

namespace EcommerceAI.Services;

public interface IAIService
{
	System.Threading.Tasks.Task<string> GenerateProductDescriptionAsync(GenerateDescriptionRequestDTO dto);

	System.Threading.Tasks.Task<ReviewSummaryResponseDTO> SummarizeReviewsAsync(int productId);

	System.Threading.Tasks.Task<System.Collections.Generic.IEnumerable<SmartSearchResponseDTO>> SmartSearchAsync(string query);

	System.Threading.Tasks.Task<System.Collections.Generic.IEnumerable<RecommendationResponseDTO>> GetRecommendationsAsync(int productId);
}
