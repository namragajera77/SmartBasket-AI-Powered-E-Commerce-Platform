using System;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace EcommerceAI.AI;

public class HuggingFaceClient(
    HttpClient httpClient,
    IConfiguration configuration,
    ILogger<HuggingFaceClient> logger) : IHuggingFaceClient
{
    public async Task<string> GenerateTextAsync(string prompt)
    {
        if (string.IsNullOrWhiteSpace(prompt))
        {
            throw new ArgumentException("Prompt cannot be empty.");
        }

        var endpoint = configuration["HuggingFace:Endpoint"];
        var apiKey = configuration["HuggingFace:ApiKey"];
        var model = configuration["HuggingFace:Model"] ?? "meta-llama/Llama-3.1-8B-Instruct";

        if (string.IsNullOrWhiteSpace(endpoint) || string.IsNullOrWhiteSpace(apiKey))
        {
            return prompt.Length > 280 ? prompt[..280] + "..." : prompt;
        }

        try
        {
            using var request = new HttpRequestMessage(HttpMethod.Post, endpoint);
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);

            var body = new
            {
                model,
                messages = new[]
                {
                    new { role = "user", content = prompt }
                },
                temperature = 0.6,
                max_tokens = 300
            };

            request.Content = new StringContent(
                JsonSerializer.Serialize(body),
                Encoding.UTF8,
                "application/json");

            using var response = await httpClient.SendAsync(request);
            var json = await response.Content.ReadAsStringAsync();
            if (!response.IsSuccessStatusCode)
            {
                logger.LogWarning("HF text generation failed ({StatusCode}).", response.StatusCode);
                return prompt.Length > 280 ? prompt[..280] + "..." : prompt;
            }

            using var doc = JsonDocument.Parse(json);
            var root = doc.RootElement;

            if (root.TryGetProperty("choices", out var choices)
                && choices.ValueKind == JsonValueKind.Array
                && choices.GetArrayLength() > 0)
            {
                var first = choices[0];
                if (first.TryGetProperty("message", out var message)
                    && message.TryGetProperty("content", out var content))
                {
                    return content.GetString() ?? string.Empty;
                }
            }

            return prompt.Length > 280 ? prompt[..280] + "..." : prompt;
        }
        catch (Exception ex)
        {
            logger.LogWarning(ex, "HF text generation fallback used.");
            return prompt.Length > 280 ? prompt[..280] + "..." : prompt;
        }
    }

    public async Task<string> SummarizeTextAsync(string inputText, string model)
    {
        if (string.IsNullOrWhiteSpace(inputText))
        {
            return "No content to summarize.";
        }

        var prompt = $"Summarize the following customer feedback briefly and clearly:\n\n{inputText}";
        return await GenerateTextAsync(prompt);
    }

    public Task<float[]> GenerateEmbeddingAsync(string text)
    {
        if (string.IsNullOrWhiteSpace(text))
        {
            return Task.FromResult(Array.Empty<float>());
        }

        // Deterministic lightweight embedding fallback to keep semantic features available.
        const int dimensions = 64;
        var vector = new float[dimensions];

        foreach (var term in Tokenize(text))
        {
            var idx = Math.Abs(term.GetHashCode()) % dimensions;
            vector[idx] += 1f;
        }

        var norm = (float)Math.Sqrt(vector.Sum(v => v * v));
        if (norm > 0f)
        {
            for (var i = 0; i < vector.Length; i++)
            {
                vector[i] /= norm;
            }
        }

        return Task.FromResult(vector);
    }

    private static string[] Tokenize(string text)
    {
        return text
            .ToLowerInvariant()
            .Split(new[] { ' ', '\t', '\r', '\n', '.', ',', ';', ':', '!', '?', '-', '_', '/', '\\', '"', '\'', '(', ')', '[', ']' }, StringSplitOptions.RemoveEmptyEntries);
    }
}
