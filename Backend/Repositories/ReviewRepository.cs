using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using EcommerceAI.Data;
using EcommerceAI.Models;
using Microsoft.EntityFrameworkCore;

namespace EcommerceAI.Repositories;

public class ReviewRepository(AppDbContext context) : IReviewRepository
{
    public async Task<IEnumerable<Review>> GetProductReviewsAsync(int productId)
    {
        return await context.Reviews
            .Include(r => r.User)
            .Where(r => r.ProductId == productId)
            .OrderByDescending(r => r.CreatedAtUtc)
            .ToListAsync();
    }

    public async Task<Review?> GetUserReviewAsync(int userId, int productId)
    {
        return await context.Reviews
            .FirstOrDefaultAsync(r => r.UserId == userId && r.ProductId == productId);
    }

    public async Task<Review?> GetByIdAsync(int id)
    {
        return await context.Reviews
            .Include(r => r.User)
            .Include(r => r.Product)
            .FirstOrDefaultAsync(r => r.Id == id);
    }

    public async Task AddAsync(Review review)
    {
        await context.Reviews.AddAsync(review);
        await context.SaveChangesAsync();
    }

    public async Task UpdateAsync(Review review)
    {
        context.Reviews.Update(review);
        await context.SaveChangesAsync();
    }

    public async Task DeleteAsync(Review review)
    {
        context.Reviews.Remove(review);
        await context.SaveChangesAsync();
    }
}
