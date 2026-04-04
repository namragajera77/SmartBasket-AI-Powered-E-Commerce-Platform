using System.Diagnostics;
using System.Runtime.CompilerServices;

namespace EcommerceAI.DTOs;

public class CartItemResponseDTO
{
	[field: CompilerGenerated]
		public int CartItemId
	{
		[CompilerGenerated]
		get;
		[CompilerGenerated]
		set;
	}

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
		public string? ImageUrl
	{
		[CompilerGenerated]
		get;
		[CompilerGenerated]
		set;
	}

	[field: CompilerGenerated]
		public decimal Price
	{
		[CompilerGenerated]
		get;
		[CompilerGenerated]
		set;
	}

	[field: CompilerGenerated]
		public int Quantity
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

