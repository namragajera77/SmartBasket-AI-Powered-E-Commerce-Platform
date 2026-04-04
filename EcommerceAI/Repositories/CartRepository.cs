using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using EcommerceAI.Data;
using EcommerceAI.Models;
using Microsoft.EntityFrameworkCore;

namespace EcommerceAI.Repositories;

public class CartRepository(AppDbContext context) : ICartRepository
{
    public async Task<IEnumerable<CartItem>> GetUserCartAsync(int userId)
    {
        return await context.CartItems
            .Include(ci => ci.Product)
            .Where(ci => ci.UserId == userId)
            .OrderByDescending(ci => ci.AddedAtUtc)
            .ToListAsync();
    }

    public async Task<CartItem?> GetCartItemAsync(int userId, int productId)
    {
        return await context.CartItems
            .Include(ci => ci.Product)
            .FirstOrDefaultAsync(ci => ci.UserId == userId && ci.ProductId == productId);
    }

    public async Task AddAsync(CartItem cartItem)
    {
        await context.CartItems.AddAsync(cartItem);
        await context.SaveChangesAsync();
    }

    public async Task UpdateAsync(CartItem cartItem)
    {
        context.CartItems.Update(cartItem);
        await context.SaveChangesAsync();
    }

    public async Task RemoveAsync(CartItem cartItem)
    {
        context.CartItems.Remove(cartItem);
        await context.SaveChangesAsync();
    }
}
