using System.ComponentModel.DataAnnotations;
using System.Diagnostics;
using System.Runtime.CompilerServices;

namespace EcommerceAI.DTOs;

public class UpdateReviewDTO
{
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

