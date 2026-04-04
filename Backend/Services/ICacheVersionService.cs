namespace EcommerceAI.Services;

public interface ICacheVersionService
{
	int ProductVersion { get; }

	int CategoryVersion { get; }

	int AiSearchVersion { get; }

	void InvalidateProducts();

	void InvalidateCategories();

	void InvalidateAiSearch();
}
