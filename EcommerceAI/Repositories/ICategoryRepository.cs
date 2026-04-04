using System.Collections.Generic;
using System.Threading.Tasks;
using EcommerceAI.Models;

namespace EcommerceAI.Repositories;

public interface ICategoryRepository
{
	System.Threading.Tasks.Task<System.Collections.Generic.IEnumerable<Category>> GetAllAsync();

	System.Threading.Tasks.Task<Category?> GetByIdAsync(int id);

	System.Threading.Tasks.Task<bool> ExistsAsync(int id);

	System.Threading.Tasks.Task AddAsync(Category category);
}
