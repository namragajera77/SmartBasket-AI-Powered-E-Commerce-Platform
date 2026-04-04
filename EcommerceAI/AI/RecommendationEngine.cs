using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using EcommerceAI.Models;
using Microsoft.Extensions.Caching.Memory;

namespace EcommerceAI.AI;

public class RecommendationEngine(IHuggingFaceClient huggingFaceClient, IMemoryCache memoryCache)
{
    private static readonly TimeSpan EmbeddingCacheDuration = TimeSpan.FromHours(6);

    public async Task<IEnumerable<(Product Product, double Score)>> GetSimilarProductsAsync(Product sourceProduct, IEnumerable<Product> candidateProducts, int top = 5)
    {
        var candidates = candidateProducts
            .Where(p => p.Id != sourceProduct.Id)
            .ToList();

        if (candidates.Count == 0)
        {
            return Array.Empty<(Product, double)>();
        }

        var sourceEmbedding = await GetProductEmbeddingAsync(sourceProduct);
        var scored = new List<(Product, double)>();

        foreach (var product in candidates)
        {
            var embedding = await GetProductEmbeddingAsync(product);
            var score = CosineSimilarity(sourceEmbedding, embedding);
            scored.Add((product, score));
        }

        return scored
            .OrderByDescending(x => x.Item2)
            .Take(Math.Max(1, top))
            .ToList();
    }

    public double CosineSimilarity(float[] vectorA, float[] vectorB)
    {
        if (vectorA.Length == 0 || vectorB.Length == 0 || vectorA.Length != vectorB.Length)
        {
            return 0d;
        }

        double dot = 0d;
        double magA = 0d;
        double magB = 0d;

        for (var i = 0; i < vectorA.Length; i++)
        {
            dot += vectorA[i] * vectorB[i];
            magA += vectorA[i] * vectorA[i];
            magB += vectorB[i] * vectorB[i];
        }

        if (magA == 0d || magB == 0d)
        {
            return 0d;
        }

        return dot / (Math.Sqrt(magA) * Math.Sqrt(magB));
    }

    private Task<float[]> GetProductEmbeddingAsync(Product product)
    {
        var cacheKey = BuildEmbeddingCacheKey(product);
        return memoryCache.GetOrCreateAsync(cacheKey, async entry =>
        {
            entry.AbsoluteExpirationRelativeToNow = EmbeddingCacheDuration;
            entry.SlidingExpiration = TimeSpan.FromHours(1);
            var text = BuildProductText(product);
            return await huggingFaceClient.GenerateEmbeddingAsync(text);
        })!;
    }

    private static string BuildProductText(Product product)
    {
        var category = product.Category?.Name ?? string.Empty;
        return $"{product.Name}. {product.Description}. Category: {category}".Trim();
    }

    private static string BuildEmbeddingCacheKey(Product product)
    {
        var description = product.Description ?? string.Empty;
        return $"recommendation-embedding:{product.Id}:{product.Name}:{description}:{product.CategoryId}:{product.Price}";
    }
}
