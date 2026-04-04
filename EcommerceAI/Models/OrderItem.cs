using System.ComponentModel.DataAnnotations;
using System.Diagnostics;
using System.Runtime.CompilerServices;

namespace EcommerceAI.Models;

public class OrderItem
{
	[field: CompilerGenerated]
		public int Id
	{
		[CompilerGenerated]
		get;
		[CompilerGenerated]
		set;
	}

	[field: CompilerGenerated]
		public int OrderId
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

	[Range(1, 2147483647)]
	[field: CompilerGenerated]
		public int Quantity
	{
		[CompilerGenerated]
		get;
		[CompilerGenerated]
		set;
	} = 1;

	[Range(0.0, 1.7976931348623157E+308)]
	[field: CompilerGenerated]
		public decimal UnitPrice
	{
		[CompilerGenerated]
		get;
		[CompilerGenerated]
		set;
	}

	[field: CompilerGenerated]
		public Order Order
	{
		[CompilerGenerated]
		get;
		[CompilerGenerated]
		set;
	} = null;

	[field: CompilerGenerated]
		public Product Product
	{
		[CompilerGenerated]
		get;
		[CompilerGenerated]
		set;
	} = null;
}

