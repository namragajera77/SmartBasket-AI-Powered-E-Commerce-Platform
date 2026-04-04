using System.ComponentModel.DataAnnotations;
using System.Diagnostics;
using System.Runtime.CompilerServices;

namespace EcommerceAI.DTOs;

public class AddToCartDTO
{
	[Range(1, 2147483647)]
	[field: CompilerGenerated]
		public int ProductId
	{
		[CompilerGenerated]
		get;
		[CompilerGenerated]
		set;
	}

	[Range(1, 2147483647)]
	[field: CompilerGenerated]
		public int Quantity
	{
		[CompilerGenerated]
		get;
		[CompilerGenerated]
		set;
	}
}

