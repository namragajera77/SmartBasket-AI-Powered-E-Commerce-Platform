using System.ComponentModel.DataAnnotations;
using System.Diagnostics;
using System.Runtime.CompilerServices;

namespace EcommerceAI.DTOs;

public class CheckoutRequestDTO
{
	[Required]
	[MaxLength(500)]
	[field: CompilerGenerated]
		public string ShippingAddress
	{
		[CompilerGenerated]
		get;
		[CompilerGenerated]
		set;
	} = string.Empty;
}

