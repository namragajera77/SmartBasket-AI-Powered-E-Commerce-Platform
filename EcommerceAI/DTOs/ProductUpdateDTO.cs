using System.ComponentModel.DataAnnotations;
using System.Diagnostics;
using System.Runtime.CompilerServices;

namespace EcommerceAI.DTOs;

public class ProductUpdateDTO
{
	[Required]
	[MaxLength(200)]
	[field: CompilerGenerated]
		public string Name
	{
		[CompilerGenerated]
		get;
		[CompilerGenerated]
		set;
	} = string.Empty;

	[MaxLength(2000)]
	[field: CompilerGenerated]
		public string? Description
	{
		[CompilerGenerated]
		get;
		[CompilerGenerated]
		set;
	}

	[Range(0.0, 1.7976931348623157E+308)]
	[field: CompilerGenerated]
		public decimal Price
	{
		[CompilerGenerated]
		get;
		[CompilerGenerated]
		set;
	}

	[Range(0, 2147483647)]
	[field: CompilerGenerated]
		public int StockQuantity
	{
		[CompilerGenerated]
		get;
		[CompilerGenerated]
		set;
	}

	[Range(1, 2147483647)]
	[field: CompilerGenerated]
		public int CategoryId
	{
		[CompilerGenerated]
		get;
		[CompilerGenerated]
		set;
	}

	[MaxLength(500)]
	[field: CompilerGenerated]
		public string? ImageUrl
	{
		[CompilerGenerated]
		get;
		[CompilerGenerated]
		set;
	}

	[field: CompilerGenerated]
		public bool IsActive
	{
		[CompilerGenerated]
		get;
		[CompilerGenerated]
		set;
	}
}

