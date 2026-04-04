using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using EcommerceAI.DTOs;
using EcommerceAI.Models;
using EcommerceAI.Repositories;

namespace EcommerceAI.Services;

public class CartService(ICartRepository cartRepository, IProductRepository productRepository) : ICartService
{
    public async Task<IEnumerable<CartItemResponseDTO>> GetCartAsync(int userId)
    {
        var items = await cartRepository.GetUserCartAsync(userId);
        return items.Select(MapItem);
    }

    public async Task AddToCartAsync(int userId, AddToCartDTO dto)
    {
        var product = await productRepository.GetByIdAsync(dto.ProductId)
            ?? throw new KeyNotFoundException("Product not found.");

        if (!product.IsActive)
        {
            throw new InvalidOperationException("Product is inactive.");
        }

        var existing = await cartRepository.GetCartItemAsync(userId, dto.ProductId);
        if (existing is null)
        {
            await cartRepository.AddAsync(new CartItem
            {
                UserId = userId,
                ProductId = dto.ProductId,
                Quantity = dto.Quantity
            });
            return;
        }

        existing.Quantity += dto.Quantity;
        await cartRepository.UpdateAsync(existing);
    }

    public async Task UpdateCartItemAsync(int userId, int cartItemId, UpdateCartItemDTO dto)
    {
        var items = await cartRepository.GetUserCartAsync(userId);
        var item = items.FirstOrDefault(ci => ci.Id == cartItemId)
            ?? throw new KeyNotFoundException("Cart item not found.");

        item.Quantity = dto.Quantity;
        await cartRepository.UpdateAsync(item);
    }

    public async Task RemoveCartItemAsync(int userId, int cartItemId)
    {
        var items = await cartRepository.GetUserCartAsync(userId);
        var item = items.FirstOrDefault(ci => ci.Id == cartItemId)
            ?? throw new KeyNotFoundException("Cart item not found.");

        await cartRepository.RemoveAsync(item);
    }

    private static CartItemResponseDTO MapItem(CartItem item)
    {
        return new CartItemResponseDTO
        {
            CartItemId = item.Id,
            ProductId = item.ProductId,
            ProductName = item.Product?.Name ?? string.Empty,
            ImageUrl = item.Product?.ImageUrl,
            Price = item.Product?.Price ?? 0m,
            Quantity = item.Quantity,
            Subtotal = (item.Product?.Price ?? 0m) * item.Quantity
        };
    }
}
