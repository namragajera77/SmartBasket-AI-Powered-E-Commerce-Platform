using System.Threading.Tasks;
using EcommerceAI.Data;
using EcommerceAI.Models;
using Microsoft.EntityFrameworkCore;

namespace EcommerceAI.Repositories;

public class RefreshTokenRepository(AppDbContext context) : IRefreshTokenRepository
{
    public async Task AddAsync(RefreshToken refreshToken)
    {
        await context.RefreshTokens.AddAsync(refreshToken);
    }

    public async Task<RefreshToken?> GetByTokenHashAsync(string tokenHash)
    {
        return await context.RefreshTokens
            .Include(rt => rt.User)
            .FirstOrDefaultAsync(rt => rt.TokenHash == tokenHash);
    }

    public async Task SaveChangesAsync()
    {
        await context.SaveChangesAsync();
    }
}
