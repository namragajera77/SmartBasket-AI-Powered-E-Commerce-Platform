using System.Collections.Generic;
using System.Threading.Tasks;
using EcommerceAI.Models;

namespace EcommerceAI.Repositories;

public interface ICartRepository
{
	System.Threading.Tasks.Task<System.Collections.Generic.IEnumerable<CartItem>> GetUserCartAsync(int userId);

	System.Threading.Tasks.Task<CartItem?> GetCartItemAsync(int userId, int productId);

	System.Threading.Tasks.Task AddAsync(CartItem cartItem);

	System.Threading.Tasks.Task UpdateAsync(CartItem cartItem);

	System.Threading.Tasks.Task RemoveAsync(CartItem cartItem);
}
