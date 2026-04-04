using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using EcommerceAI.Data;
using EcommerceAI.Models;
using Microsoft.EntityFrameworkCore;

namespace EcommerceAI.Repositories;

public class OrderRepository(AppDbContext context) : IOrderRepository
{
    public async Task<Order?> GetByIdAsync(int id)
    {
        return await context.Orders
            .Include(o => o.Customer)
            .Include(o => o.DeliveryBoy)
            .Include(o => o.OrderItems)
            .ThenInclude(oi => oi.Product)
            .FirstOrDefaultAsync(o => o.Id == id);
    }

    public async Task<IEnumerable<Order>> GetUserOrdersAsync(int userId)
    {
        return await context.Orders
            .Include(o => o.OrderItems)
            .ThenInclude(oi => oi.Product)
            .Where(o => o.UserId == userId)
            .OrderByDescending(o => o.OrderedAtUtc)
            .ToListAsync();
    }

    public async Task<IEnumerable<Order>> GetAllAsync()
    {
        return await context.Orders
            .Include(o => o.Customer)
            .Include(o => o.DeliveryBoy)
            .Include(o => o.OrderItems)
            .ThenInclude(oi => oi.Product)
            .OrderByDescending(o => o.OrderedAtUtc)
            .ToListAsync();
    }

    public async Task<IEnumerable<ValueTuple<Product, int>>> GetFrequentlyBoughtTogetherAsync(int productId, int take = 5)
    {
        var relatedOrderIds = await context.OrderItems
            .Where(oi => oi.ProductId == productId)
            .Select(oi => oi.OrderId)
            .Distinct()
            .ToListAsync();

        if (relatedOrderIds.Count == 0)
        {
            return Enumerable.Empty<(Product, int)>();
        }

        var grouped = await context.OrderItems
            .Where(oi => relatedOrderIds.Contains(oi.OrderId) && oi.ProductId != productId)
            .GroupBy(oi => oi.ProductId)
            .Select(g => new { ProductId = g.Key, Frequency = g.Count() })
            .OrderByDescending(x => x.Frequency)
            .Take(take)
            .ToListAsync();

        var productIds = grouped.Select(g => g.ProductId).ToList();
        var products = await context.Products
            .Where(p => productIds.Contains(p.Id))
            .ToDictionaryAsync(p => p.Id);

        return grouped
            .Where(g => products.ContainsKey(g.ProductId))
            .Select(g => (products[g.ProductId], g.Frequency))
            .ToList();
    }

    public async Task AddAsync(Order order)
    {
        await context.Orders.AddAsync(order);
        await context.SaveChangesAsync();
    }

    public async Task UpdateAsync(Order order)
    {
        context.Orders.Update(order);
        await context.SaveChangesAsync();
    }
}
