using System.Collections.Generic;
using System.Threading.Tasks;
using EcommerceAI.Models;

namespace EcommerceAI.Repositories;

public interface IReviewRepository
{
	System.Threading.Tasks.Task<System.Collections.Generic.IEnumerable<Review>> GetProductReviewsAsync(int productId);

	System.Threading.Tasks.Task<Review?> GetUserReviewAsync(int userId, int productId);

	System.Threading.Tasks.Task<Review?> GetByIdAsync(int id);

	System.Threading.Tasks.Task AddAsync(Review review);

	System.Threading.Tasks.Task UpdateAsync(Review review);

	System.Threading.Tasks.Task DeleteAsync(Review review);
}
