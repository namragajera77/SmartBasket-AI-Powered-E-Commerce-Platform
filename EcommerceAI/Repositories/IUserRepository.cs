using System.Threading.Tasks;
using EcommerceAI.Models;

namespace EcommerceAI.Repositories;

public interface IUserRepository
{
	System.Threading.Tasks.Task<User?> GetByIdAsync(int id);

	System.Threading.Tasks.Task<User?> GetByEmailAsync(string email);

	System.Threading.Tasks.Task<System.Collections.Generic.IReadOnlyList<User>> GetByRoleAsync(string role);

	System.Threading.Tasks.Task AddUserAsync(User user);

	System.Threading.Tasks.Task UpdateUserAsync(User user);

	System.Threading.Tasks.Task<bool> EmailExistsAsync(string email);
}
