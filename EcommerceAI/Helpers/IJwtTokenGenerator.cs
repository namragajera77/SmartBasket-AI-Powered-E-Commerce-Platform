using EcommerceAI.Models;

namespace EcommerceAI.Helpers;

public interface IJwtTokenGenerator
{
	string GenerateToken(User user);
}
