using System;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics;
using System.Runtime.CompilerServices;

namespace EcommerceAI.Models;

public class Review
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

	[Range(1, 5)]
	[field: CompilerGenerated]
		public int Rating
	{
		[CompilerGenerated]
		get;
		[CompilerGenerated]
		set;
	}

	[MaxLength(2000)]
	[field: CompilerGenerated]
		public string? Comment
	{
		[CompilerGenerated]
		get;
		[CompilerGenerated]
		set;
	}

	[field: CompilerGenerated]
		public System.DateTime CreatedAtUtc
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

