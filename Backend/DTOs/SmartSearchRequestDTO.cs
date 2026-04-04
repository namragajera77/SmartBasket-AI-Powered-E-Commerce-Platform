using System.ComponentModel.DataAnnotations;
using System.Diagnostics;
using System.Runtime.CompilerServices;

namespace EcommerceAI.DTOs;

public class SmartSearchRequestDTO
{
	[Required]
	[MaxLength(500)]
	[field: CompilerGenerated]
		public string Query
	{
		[CompilerGenerated]
		get;
		[CompilerGenerated]
		set;
	} = string.Empty;
}

