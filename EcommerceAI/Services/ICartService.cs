using System.Collections.Generic;
using System.Threading.Tasks;
using EcommerceAI.DTOs;

namespace EcommerceAI.Services;

public interface ICartService
{
	System.Threading.Tasks.Task<System.Collections.Generic.IEnumerable<CartItemResponseDTO>> GetCartAsync(int userId);

	System.Threading.Tasks.Task AddToCartAsync(int userId, AddToCartDTO dto);

	System.Threading.Tasks.Task UpdateCartItemAsync(int userId, int cartItemId, UpdateCartItemDTO dto);

	System.Threading.Tasks.Task RemoveCartItemAsync(int userId, int cartItemId);
}
