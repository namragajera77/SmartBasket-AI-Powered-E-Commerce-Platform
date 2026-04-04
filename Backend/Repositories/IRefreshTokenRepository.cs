using System.Threading.Tasks;
using EcommerceAI.Models;

namespace EcommerceAI.Repositories;

public interface IRefreshTokenRepository
{
	System.Threading.Tasks.Task AddAsync(RefreshToken refreshToken);

	System.Threading.Tasks.Task<RefreshToken?> GetByTokenHashAsync(string tokenHash);

	System.Threading.Tasks.Task SaveChangesAsync();
}
