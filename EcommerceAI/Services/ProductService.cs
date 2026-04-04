using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using EcommerceAI.DTOs;
using EcommerceAI.Models;
using EcommerceAI.Repositories;
using Microsoft.AspNetCore.Http;

namespace EcommerceAI.Services;

public class ProductService(IProductRepository productRepository, ICategoryRepository categoryRepository) : IProductService
{
    public async Task<PaginatedResponse<ProductResponseDTO>> GetProductsAsync(ProductQueryParametersDTO queryParameters)
    {
        var (items, total) = await productRepository.GetPagedAsync(queryParameters);
        return new PaginatedResponse<ProductResponseDTO>
        {
            Page = queryParameters.Page,
            PageSize = queryParameters.PageSize,
            TotalItems = total,
            Items = items.Select(MapProduct)
        };
    }

    public async Task<ProductResponseDTO?> GetProductAsync(int id)
    {
        var product = await productRepository.GetByIdAsync(id);
        return product is null ? null : MapProduct(product);
    }

    public async Task<string> UploadProductImageAsync(IFormFile imageFile)
    {
        if (imageFile is null || imageFile.Length == 0)
        {
            throw new ArgumentException("Image file is required.");
        }

        var uploadsRoot = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
        Directory.CreateDirectory(uploadsRoot);

        var extension = Path.GetExtension(imageFile.FileName);
        var fileName = $"{Guid.NewGuid():N}{extension}";
        var filePath = Path.Combine(uploadsRoot, fileName);

        await using var stream = File.Create(filePath);
        await imageFile.CopyToAsync(stream);

        return $"/uploads/{fileName}";
    }

    public async Task<ProductResponseDTO> CreateProductAsync(ProductCreateDTO dto)
    {
        if (!await categoryRepository.ExistsAsync(dto.CategoryId))
        {
            throw new KeyNotFoundException("Category not found.");
        }

        var product = new Product
        {
            Name = dto.Name.Trim(),
            Description = dto.Description,
            Price = dto.Price,
            StockQuantity = dto.StockQuantity,
            CategoryId = dto.CategoryId,
            ImageUrl = dto.ImageUrl,
            IsActive = true
        };

        await productRepository.AddAsync(product);
        var reloaded = await productRepository.GetByIdAsync(product.Id) ?? product;
        return MapProduct(reloaded);
    }

    public async Task UpdateProductAsync(int id, ProductUpdateDTO dto)
    {
        var product = await productRepository.GetByIdAsync(id)
            ?? throw new KeyNotFoundException("Product not found.");

        if (!await categoryRepository.ExistsAsync(dto.CategoryId))
        {
            throw new KeyNotFoundException("Category not found.");
        }

        product.Name = dto.Name.Trim();
        product.Description = dto.Description;
        product.Price = dto.Price;
        product.StockQuantity = dto.StockQuantity;
        product.CategoryId = dto.CategoryId;
        product.ImageUrl = dto.ImageUrl;
        product.IsActive = dto.IsActive;

        await productRepository.UpdateAsync(product);
    }

    public async Task DeleteProductAsync(int id)
    {
        var product = await productRepository.GetByIdAsync(id)
            ?? throw new KeyNotFoundException("Product not found.");

        await productRepository.DeleteAsync(product);
    }

    private static ProductResponseDTO MapProduct(Product product)
    {
        return new ProductResponseDTO
        {
            Id = product.Id,
            Name = product.Name,
            Description = product.Description,
            Price = product.Price,
            StockQuantity = product.StockQuantity,
            CategoryName = product.Category?.Name ?? string.Empty,
            ImageUrl = product.ImageUrl,
            CreatedAtUtc = product.CreatedAtUtc
        };
    }
}
