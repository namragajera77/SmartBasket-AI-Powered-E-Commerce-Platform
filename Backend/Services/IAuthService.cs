using System.Threading.Tasks;
using EcommerceAI.DTOs;

namespace EcommerceAI.Services;

public interface IAuthService
{
	System.Threading.Tasks.Task<AuthResponseDTO> RegisterAsync(RegisterRequestDTO request);

	System.Threading.Tasks.Task<AuthResponseDTO> LoginAsync(LoginRequestDTO request);

	System.Threading.Tasks.Task<AuthResponseDTO> RefreshTokenAsync(RefreshTokenRequestDTO request);

	System.Threading.Tasks.Task ResetPasswordAsync(string email, string newPassword);
}
