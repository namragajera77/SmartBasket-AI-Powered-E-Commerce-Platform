using System.Threading;

namespace EcommerceAI.Services;

public class CacheVersionService : ICacheVersionService
{
	private int _productVersion = 1;

	private int _categoryVersion = 1;

	private int _aiSearchVersion = 1;

	public int ProductVersion => _productVersion;

	public int CategoryVersion => _categoryVersion;

	public int AiSearchVersion => _aiSearchVersion;

	public void InvalidateProducts()
	{
		Interlocked.Increment(ref _productVersion);
	}

	public void InvalidateCategories()
	{
		Interlocked.Increment(ref _categoryVersion);
	}

	public void InvalidateAiSearch()
	{
		Interlocked.Increment(ref _aiSearchVersion);
	}
}
