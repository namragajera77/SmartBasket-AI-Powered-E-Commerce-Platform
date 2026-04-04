using System.Diagnostics;
using System.Runtime.CompilerServices;

namespace EcommerceAI.DTOs;

public class ReviewSummaryResponseDTO
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
		public string Summary
	{
		[CompilerGenerated]
		get;
		[CompilerGenerated]
		set;
	} = string.Empty;

	[field: CompilerGenerated]
		public int ReviewCount
	{
		[CompilerGenerated]
		get;
		[CompilerGenerated]
		set;
	}
}

