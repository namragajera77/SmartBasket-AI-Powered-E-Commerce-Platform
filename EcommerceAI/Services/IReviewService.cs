using System.Collections.Generic;
using System.Threading.Tasks;
using EcommerceAI.DTOs;

namespace EcommerceAI.Services;

public interface IReviewService
{
	System.Threading.Tasks.Task<System.Collections.Generic.IEnumerable<ReviewResponseDTO>> GetProductReviewsAsync(int productId);

	System.Threading.Tasks.Task CreateReviewAsync(int userId, CreateReviewDTO dto);

	System.Threading.Tasks.Task UpdateReviewAsync(int userId, int reviewId, UpdateReviewDTO dto);

	System.Threading.Tasks.Task DeleteReviewAsync(int userId, int reviewId);
}
