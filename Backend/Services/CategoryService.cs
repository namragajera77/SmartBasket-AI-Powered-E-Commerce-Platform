using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using EcommerceAI.DTOs;
using EcommerceAI.Models;
using EcommerceAI.Repositories;

namespace EcommerceAI.Services;

public class CategoryService(ICategoryRepository categoryRepository) : ICategoryService
{
    public async Task<IEnumerable<CategoryResponseDTO>> GetCategoriesAsync()
    {
        var categories = await categoryRepository.GetAllAsync();
        return categories.Select(MapCategory);
    }

    public async Task<CategoryResponseDTO?> GetCategoryAsync(int id)
    {
        var category = await categoryRepository.GetByIdAsync(id);
        return category is null ? null : MapCategory(category);
    }

    public async Task<CategoryResponseDTO> CreateCategoryAsync(CategoryCreateDTO dto)
    {
        var category = new Category
        {
            Name = dto.Name.Trim(),
            Description = dto.Description
        };

        await categoryRepository.AddAsync(category);
        return MapCategory(category);
    }

    private static CategoryResponseDTO MapCategory(Category category)
    {
        return new CategoryResponseDTO
        {
            Id = category.Id,
            Name = category.Name,
            Description = category.Description,
            CreatedAtUtc = category.CreatedAtUtc
        };
    }
}
