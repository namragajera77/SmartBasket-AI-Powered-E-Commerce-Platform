using System;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics;
using System.Runtime.CompilerServices;

namespace EcommerceAI.Models;

public class CartItem
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
		public int UserId
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

	[field: CompilerGenerated]
		public System.DateTime AddedAtUtc
	{
		[CompilerGenerated]
		get;
		[CompilerGenerated]
		set;
	} = System.DateTime.UtcNow;

	[field: CompilerGenerated]
		public User User
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

