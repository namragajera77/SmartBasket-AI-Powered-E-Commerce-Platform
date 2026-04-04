using System.ComponentModel.DataAnnotations;
using System.Diagnostics;
using System.Runtime.CompilerServices;

namespace EcommerceAI.DTOs;

public class RegisterRequestDTO
{
	[Required]
	[MaxLength(100)]
	[field: CompilerGenerated]
		public string FirstName
	{
		[CompilerGenerated]
		get;
		[CompilerGenerated]
		set;
	} = string.Empty;

	[Required]
	[MaxLength(100)]
	[field: CompilerGenerated]
		public string LastName
	{
		[CompilerGenerated]
		get;
		[CompilerGenerated]
		set;
	} = string.Empty;

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
	[MinLength(6)]
	[MaxLength(100)]
	[field: CompilerGenerated]
		public string Password
	{
		[CompilerGenerated]
		get;
		[CompilerGenerated]
		set;
	} = string.Empty;

	[MaxLength(20)]
	[field: CompilerGenerated]
		public string? PhoneNumber
	{
		[CompilerGenerated]
		get;
		[CompilerGenerated]
		set;
	}
}

