using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using EcommerceAI.DTOs;
using EcommerceAI.Models;
using EcommerceAI.Repositories;

namespace EcommerceAI.Services;

public class ReviewService(IReviewRepository reviewRepository, IUserRepository userRepository) : IReviewService
{
    public async Task<IEnumerable<ReviewResponseDTO>> GetProductReviewsAsync(int productId)
    {
        var reviews = await reviewRepository.GetProductReviewsAsync(productId);
        return reviews.Select(MapReview);
    }

    public async Task CreateReviewAsync(int userId, CreateReviewDTO dto)
    {
        var existing = await reviewRepository.GetUserReviewAsync(userId, dto.ProductId);
        if (existing is not null)
        {
            throw new InvalidOperationException("You already reviewed this product.");
        }

        var review = new Review
        {
            UserId = userId,
            ProductId = dto.ProductId,
            Rating = dto.Rating,
            Comment = dto.Comment
        };

        await reviewRepository.AddAsync(review);
    }

    public async Task UpdateReviewAsync(int userId, int reviewId, UpdateReviewDTO dto)
    {
        var review = await reviewRepository.GetByIdAsync(reviewId)
            ?? throw new KeyNotFoundException("Review not found.");

        if (review.UserId != userId)
        {
            throw new UnauthorizedAccessException("You can only update your own review.");
        }

        review.Rating = dto.Rating;
        review.Comment = dto.Comment;
        await reviewRepository.UpdateAsync(review);
    }

    public async Task DeleteReviewAsync(int userId, int reviewId)
    {
        var review = await reviewRepository.GetByIdAsync(reviewId)
            ?? throw new KeyNotFoundException("Review not found.");

        if (review.UserId != userId)
        {
            throw new UnauthorizedAccessException("You can only delete your own review.");
        }

        await reviewRepository.DeleteAsync(review);
    }

    private static ReviewResponseDTO MapReview(Review review)
    {
        return new ReviewResponseDTO
        {
            ReviewId = review.Id,
            UserName = review.User is null ? "User" : $"{review.User.FirstName} {review.User.LastName}".Trim(),
            Rating = review.Rating,
            Comment = review.Comment,
            CreatedAtUtc = review.CreatedAtUtc
        };
    }
}
