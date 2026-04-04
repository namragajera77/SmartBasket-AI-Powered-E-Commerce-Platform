using System.Threading.Tasks;
using EcommerceAI.DTOs;
using EcommerceAI.Services;
using Microsoft.AspNetCore.Mvc;

namespace EcommerceAI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController(IAuthService authService) : ControllerBase
{
    [HttpPost("register")]
    public async Task<ActionResult<AuthResponseDTO>> Register([FromBody] RegisterRequestDTO request)
    {
        var response = await authService.RegisterAsync(request);
        return Ok(response);
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponseDTO>> Login([FromBody] LoginRequestDTO request)
    {
        var response = await authService.LoginAsync(request);
        return Ok(response);
    }

    [HttpPost("refresh")]
    public async Task<ActionResult<AuthResponseDTO>> Refresh([FromBody] RefreshTokenRequestDTO request)
    {
        var response = await authService.RefreshTokenAsync(request);
        return Ok(response);
    }

    [HttpPost("dev-reset-password")]
    public async Task<IActionResult> DevResetPassword([FromBody] DevResetPasswordRequestDTO request)
    {
        await authService.ResetPasswordAsync(request.Email, request.NewPassword);
        return NoContent();
    }
}
