using System.ComponentModel.DataAnnotations;
using System.Diagnostics;
using System.Runtime.CompilerServices;

namespace EcommerceAI.DTOs;

public class CreateReviewDTO
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
}

