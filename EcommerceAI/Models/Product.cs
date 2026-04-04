using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics;
using System.Runtime.CompilerServices;

namespace EcommerceAI.Models;

public class Product
{
	[field: CompilerGenerated]
		public int Id
	{
		[CompilerGenerated]
		get;
		[CompilerGenerated]
		set;
	}

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
		public int CategoryId
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
	} = true;

	[field: CompilerGenerated]
		public System.DateTime CreatedAtUtc
	{
		[CompilerGenerated]
		get;
		[CompilerGenerated]
		set;
	} = System.DateTime.UtcNow;

	[field: CompilerGenerated]
		public Category Category
	{
		[CompilerGenerated]
		get;
		[CompilerGenerated]
		set;
	} = null;

	[field: CompilerGenerated]
		public System.Collections.Generic.ICollection<CartItem> CartItems
	{
		[CompilerGenerated]
		get;
		[CompilerGenerated]
		set;
	} = (System.Collections.Generic.ICollection<CartItem>)new List<CartItem>();

	[field: CompilerGenerated]
		public System.Collections.Generic.ICollection<OrderItem> OrderItems
	{
		[CompilerGenerated]
		get;
		[CompilerGenerated]
		set;
	} = (System.Collections.Generic.ICollection<OrderItem>)new List<OrderItem>();

	[field: CompilerGenerated]
		public System.Collections.Generic.ICollection<Review> Reviews
	{
		[CompilerGenerated]
		get;
		[CompilerGenerated]
		set;
	} = (System.Collections.Generic.ICollection<Review>)new List<Review>();
}

