using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using EcommerceAI.AI;
using EcommerceAI.DTOs;
using EcommerceAI.Repositories;

namespace EcommerceAI.Services;

public class AIService(
    IProductRepository productRepository,
    IReviewRepository reviewRepository,
    IOrderRepository orderRepository,
    SmartSearchEngine smartSearchEngine,
    RecommendationEngine recommendationEngine,
    IHuggingFaceClient huggingFaceClient) : IAIService
{
    public async Task<string> GenerateProductDescriptionAsync(GenerateDescriptionRequestDTO dto)
    {
        var keywords = string.IsNullOrWhiteSpace(dto.Keywords) ? string.Empty : $" Keywords: {dto.Keywords}.";
        var prompt = $"Write a concise, attractive e-commerce product description for {dto.ProductName} in category {dto.Category}.{keywords}";
        return await huggingFaceClient.GenerateTextAsync(prompt);
    }

    public async Task<ReviewSummaryResponseDTO> SummarizeReviewsAsync(int productId)
    {
        var reviews = (await reviewRepository.GetProductReviewsAsync(productId)).ToList();
        if (reviews.Count == 0)
        {
            return new ReviewSummaryResponseDTO
            {
                ProductId = productId,
                ReviewCount = 0,
                Summary = "No reviews yet."
            };
        }

        var text = string.Join("\n", reviews.Select(r => $"{r.Rating}/5 - {r.Comment}"));
        var summary = await huggingFaceClient.SummarizeTextAsync(text, "default");

        return new ReviewSummaryResponseDTO
        {
            ProductId = productId,
            ReviewCount = reviews.Count,
            Summary = summary
        };
    }

    public async Task<IEnumerable<SmartSearchResponseDTO>> SmartSearchAsync(string query)
    {
        var products = await productRepository.GetAllAsync();
        var ranked = await smartSearchEngine.SearchAsync(query, products, 20);

        return ranked.Select(r => new SmartSearchResponseDTO
        {
            ProductId = r.Product.Id,
            Name = r.Product.Name,
            Description = r.Product.Description,
            Price = r.Product.Price,
            ImageUrl = r.Product.ImageUrl,
            SimilarityScore = r.Score
        }).ToList();
    }

    public async Task<IEnumerable<RecommendationResponseDTO>> GetRecommendationsAsync(int productId)
    {
        var source = await productRepository.GetByIdAsync(productId);
        if (source is null)
        {
            return Enumerable.Empty<RecommendationResponseDTO>();
        }

        var allProducts = await productRepository.GetAllAsync();
        var semantic = await recommendationEngine.GetSimilarProductsAsync(source, allProducts, 8);
        var alsoBought = await orderRepository.GetFrequentlyBoughtTogetherAsync(productId, 5);

        var merged = semantic
            .Select(x => new RecommendationResponseDTO
            {
                ProductId = x.Product.Id,
                Name = x.Product.Name,
                Price = x.Product.Price,
                ImageUrl = x.Product.ImageUrl,
                SimilarityScore = x.Score
            })
            .Concat(alsoBought.Select(x => new RecommendationResponseDTO
            {
                ProductId = x.Item1.Id,
                Name = x.Item1.Name,
                Price = x.Item1.Price,
                ImageUrl = x.Item1.ImageUrl,
                SimilarityScore = x.Item2
            }))
            .GroupBy(x => x.ProductId)
            .Select(g => g.OrderByDescending(i => i.SimilarityScore).First())
            .OrderByDescending(x => x.SimilarityScore)
            .Take(10)
            .ToList();

        return merged;
    }
}
