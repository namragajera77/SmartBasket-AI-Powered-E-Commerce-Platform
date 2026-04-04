using System.Collections.Generic;
using System.Threading.Tasks;
using EcommerceAI.DTOs;

namespace EcommerceAI.Services;

public interface ICategoryService
{
	System.Threading.Tasks.Task<System.Collections.Generic.IEnumerable<CategoryResponseDTO>> GetCategoriesAsync();

	System.Threading.Tasks.Task<CategoryResponseDTO?> GetCategoryAsync(int id);

	System.Threading.Tasks.Task<CategoryResponseDTO> CreateCategoryAsync(CategoryCreateDTO dto);
}
