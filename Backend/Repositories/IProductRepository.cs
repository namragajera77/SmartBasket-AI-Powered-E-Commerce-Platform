using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using EcommerceAI.DTOs;
using EcommerceAI.Models;

namespace EcommerceAI.Repositories;

public interface IProductRepository
{
	System.Threading.Tasks.Task<System.Collections.Generic.IEnumerable<Product>> GetAllAsync();

	System.Threading.Tasks.Task<ValueTuple<System.Collections.Generic.IReadOnlyList<Product>, int>> GetPagedAsync(ProductQueryParametersDTO queryParameters);

	System.Threading.Tasks.Task<Product?> GetByIdAsync(int id);

	System.Threading.Tasks.Task AddAsync(Product product);

	System.Threading.Tasks.Task UpdateAsync(Product product);

	System.Threading.Tasks.Task DeleteAsync(Product product);
}
