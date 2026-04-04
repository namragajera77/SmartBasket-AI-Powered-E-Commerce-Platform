using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using EcommerceAI.Models;

namespace EcommerceAI.Repositories;

public interface IOrderRepository
{
	System.Threading.Tasks.Task<Order?> GetByIdAsync(int id);

	System.Threading.Tasks.Task<System.Collections.Generic.IEnumerable<Order>> GetUserOrdersAsync(int userId);

	System.Threading.Tasks.Task<System.Collections.Generic.IEnumerable<Order>> GetAllAsync();

	System.Threading.Tasks.Task<System.Collections.Generic.IEnumerable<ValueTuple<Product, int>>> GetFrequentlyBoughtTogetherAsync(int productId, int take = 5);

	System.Threading.Tasks.Task AddAsync(Order order);

	System.Threading.Tasks.Task UpdateAsync(Order order);
}
