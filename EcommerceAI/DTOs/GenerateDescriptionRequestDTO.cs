using System.ComponentModel.DataAnnotations;
using System.Diagnostics;
using System.Runtime.CompilerServices;

namespace EcommerceAI.DTOs;

public class GenerateDescriptionRequestDTO
{
	[Required]
	[MaxLength(200)]
	[field: CompilerGenerated]
		public string ProductName
	{
		[CompilerGenerated]
		get;
		[CompilerGenerated]
		set;
	} = string.Empty;

	[Required]
	[MaxLength(150)]
	[field: CompilerGenerated]
		public string Category
	{
		[CompilerGenerated]
		get;
		[CompilerGenerated]
		set;
	} = string.Empty;

	[MaxLength(1000)]
	[field: CompilerGenerated]
		public string? Keywords
	{
		[CompilerGenerated]
		get;
		[CompilerGenerated]
		set;
	}
}

