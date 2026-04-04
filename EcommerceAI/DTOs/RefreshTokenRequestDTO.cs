using System.ComponentModel.DataAnnotations;
using System.Diagnostics;
using System.Runtime.CompilerServices;

namespace EcommerceAI.DTOs;

public class RefreshTokenRequestDTO
{
	[Required]
	[field: CompilerGenerated]
		public string RefreshToken
	{
		[CompilerGenerated]
		get;
		[CompilerGenerated]
		set;
	} = string.Empty;
}

