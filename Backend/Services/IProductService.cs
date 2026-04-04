using System.Threading.Tasks;
using EcommerceAI.DTOs;
using Microsoft.AspNetCore.Http;

namespace EcommerceAI.Services;

public interface IProductService
{
	System.Threading.Tasks.Task<PaginatedResponse<ProductResponseDTO>> GetProductsAsync(ProductQueryParametersDTO queryParameters);

	System.Threading.Tasks.Task<ProductResponseDTO?> GetProductAsync(int id);

	System.Threading.Tasks.Task<string> UploadProductImageAsync(IFormFile imageFile);

	System.Threading.Tasks.Task<ProductResponseDTO> CreateProductAsync(ProductCreateDTO dto);

	System.Threading.Tasks.Task UpdateProductAsync(int id, ProductUpdateDTO dto);

	System.Threading.Tasks.Task DeleteProductAsync(int id);
}
