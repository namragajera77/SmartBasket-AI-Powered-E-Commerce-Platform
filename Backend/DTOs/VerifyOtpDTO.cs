using System.ComponentModel.DataAnnotations;
using System.Diagnostics;
using System.Runtime.CompilerServices;

namespace EcommerceAI.DTOs;

public class VerifyOtpDTO
{
	[Required]
	[MaxLength(10)]
	[field: CompilerGenerated]
		public string OTP
	{
		[CompilerGenerated]
		get;
		[CompilerGenerated]
		set;
	} = string.Empty;
}

