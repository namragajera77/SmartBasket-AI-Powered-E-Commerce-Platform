using System.Threading.Tasks;

namespace EcommerceAI.AI;

public interface IHuggingFaceClient
{
	System.Threading.Tasks.Task<string> GenerateTextAsync(string prompt);

	System.Threading.Tasks.Task<string> SummarizeTextAsync(string inputText, string model);

	System.Threading.Tasks.Task<float[]> GenerateEmbeddingAsync(string text);
}
