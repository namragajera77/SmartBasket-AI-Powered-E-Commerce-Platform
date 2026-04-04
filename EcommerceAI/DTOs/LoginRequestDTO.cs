using System.ComponentModel.DataAnnotations;
using System.Diagnostics;
using System.Runtime.CompilerServices;

namespace EcommerceAI.DTOs;

public class LoginRequestDTO
{
	[Required]
	[EmailAddress]
	[MaxLength(255)]
	[field: CompilerGenerated]
		public string Email
	{
		[CompilerGenerated]
		get;
		[CompilerGenerated]
		set;
	} = string.Empty;

	[Required]
	[MaxLength(100)]
	[field: CompilerGenerated]
		public string Password
	{
		[CompilerGenerated]
		get;
		[CompilerGenerated]
		set;
	} = string.Empty;
}

