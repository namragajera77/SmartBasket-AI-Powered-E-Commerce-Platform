using System.Diagnostics;
using System.Runtime.CompilerServices;

namespace EcommerceAI.DTOs;

public class OrderItemResponseDTO
{
	[field: CompilerGenerated]
		public int ProductId
	{
		[CompilerGenerated]
		get;
		[CompilerGenerated]
		set;
	}

	[field: CompilerGenerated]
		public string ProductName
	{
		[CompilerGenerated]
		get;
		[CompilerGenerated]
		set;
	} = string.Empty;

	[field: CompilerGenerated]
		public int Quantity
	{
		[CompilerGenerated]
		get;
		[CompilerGenerated]
		set;
	}

	[field: CompilerGenerated]
		public decimal UnitPrice
	{
		[CompilerGenerated]
		get;
		[CompilerGenerated]
		set;
	}

	[field: CompilerGenerated]
		public decimal Subtotal
	{
		[CompilerGenerated]
		get;
		[CompilerGenerated]
		set;
	}
}

