using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EcommerceAI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class SecureController : ControllerBase
{
	[HttpGet("me")]
	public IActionResult Me()
	{
		return (IActionResult)(object)((ControllerBase)this).Ok((object)new
		{
			message = "Authenticated access granted."
		});
	}

	[HttpGet("admin")]
	[Authorize(Roles = "Admin")]
	public IActionResult AdminOnly()
	{
		return (IActionResult)(object)((ControllerBase)this).Ok((object)new
		{
			message = "Admin access granted."
		});
	}

	[HttpGet("customer")]
	[Authorize(Roles = "Customer")]
	public IActionResult CustomerOnly()
	{
		return (IActionResult)(object)((ControllerBase)this).Ok((object)new
		{
			message = "Customer access granted."
		});
	}

	[HttpGet("delivery")]
	[Authorize(Roles = "Delivery")]
	public IActionResult DeliveryOnly()
	{
		return (IActionResult)(object)((ControllerBase)this).Ok((object)new
		{
			message = "Delivery access granted."
		});
	}
}
