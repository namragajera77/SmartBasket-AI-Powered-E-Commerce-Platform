using System.Threading.Tasks;
using EcommerceAI.Data;
using EcommerceAI.Models;
using Microsoft.EntityFrameworkCore;

namespace EcommerceAI.Repositories;

public class UserRepository(AppDbContext context) : IUserRepository
{
    public async Task<User?> GetByIdAsync(int id)
    {
        return await context.Users.FirstOrDefaultAsync(u => u.Id == id);
    }

    public async Task<User?> GetByEmailAsync(string email)
    {
        var normalizedEmail = email.Trim().ToLowerInvariant();
        return await context.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == normalizedEmail);
    }

    public async Task AddUserAsync(User user)
    {
        await context.Users.AddAsync(user);
        await context.SaveChangesAsync();
    }

    public async Task UpdateUserAsync(User user)
    {
        context.Users.Update(user);
        await context.SaveChangesAsync();
    }

    public async Task<IReadOnlyList<User>> GetByRoleAsync(string role)
    {
        var normalizedRole = role.Trim().ToLowerInvariant();
        return await context.Users
            .Where(u => u.Role.ToLower() == normalizedRole)
            .OrderBy(u => u.FirstName)
            .ThenBy(u => u.LastName)
            .ToListAsync();
    }

    public async Task<bool> EmailExistsAsync(string email)
    {
        var normalizedEmail = email.Trim().ToLowerInvariant();
        return await context.Users.AnyAsync(u => u.Email.ToLower() == normalizedEmail);
    }
}
