using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using EcommerceAI.Models;

namespace EcommerceAI.AI;

public class SmartSearchEngine(IHuggingFaceClient huggingFaceClient)
{
    public async Task<IEnumerable<(Product Product, double Score)>> SearchAsync(string query, IEnumerable<Product> products, int top = 10)
    {
        if (string.IsNullOrWhiteSpace(query))
        {
            return Array.Empty<(Product, double)>();
        }

        var productList = products?.ToList() ?? new List<Product>();
        if (productList.Count == 0)
        {
            return Array.Empty<(Product, double)>();
        }

        var queryEmbedding = await huggingFaceClient.GenerateEmbeddingAsync(query);
        var queryTerms = ExtractTerms(query);

        var scored = new List<(Product, double)>();
        foreach (var product in productList)
        {
            var text = BuildProductText(product);
            var productEmbedding = await huggingFaceClient.GenerateEmbeddingAsync(text);
            var semantic = CosineSimilarity(queryEmbedding, productEmbedding);
            var lexical = CalculateLexicalScore(queryTerms, text);
            var score = 0.7 * semantic + 0.3 * lexical;
            scored.Add((product, score));
        }

        return scored
            .OrderByDescending(x => x.Item2)
            .Take(Math.Max(1, top))
            .ToList();
    }

    private static string BuildProductText(Product product)
    {
        return $"{product.Name} {product.Description} {product.Category?.Name}".Trim();
    }

    private static HashSet<string> ExtractTerms(string input)
    {
        return input
            .ToLowerInvariant()
            .Split(new[] { ' ', '\t', '\r', '\n', '.', ',', ';', ':', '!', '?' }, StringSplitOptions.RemoveEmptyEntries)
            .ToHashSet();
    }

    private static double CalculateLexicalScore(HashSet<string> queryTerms, string productText)
    {
        if (queryTerms.Count == 0)
        {
            return 0d;
        }

        var productTerms = ExtractTerms(productText);
        var overlap = queryTerms.Count(term => productTerms.Contains(term));
        return (double)overlap / queryTerms.Count;
    }

    private static double CosineSimilarity(float[] a, float[] b)
    {
        if (a.Length == 0 || b.Length == 0 || a.Length != b.Length)
        {
            return 0d;
        }

        double dot = 0d;
        double magA = 0d;
        double magB = 0d;

        for (var i = 0; i < a.Length; i++)
        {
            dot += a[i] * b[i];
            magA += a[i] * a[i];
            magB += b[i] * b[i];
        }

        if (magA == 0d || magB == 0d)
        {
            return 0d;
        }

        return dot / (Math.Sqrt(magA) * Math.Sqrt(magB));
    }
}
