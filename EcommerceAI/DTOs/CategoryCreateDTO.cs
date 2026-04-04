using System.ComponentModel.DataAnnotations;
using System.Diagnostics;
using System.Runtime.CompilerServices;

namespace EcommerceAI.DTOs;

public class CategoryCreateDTO
{
	[Required]
	[MaxLength(150)]
	[field: CompilerGenerated]
		public string Name
	{
		[CompilerGenerated]
		get;
		[CompilerGenerated]
		set;
	} = string.Empty;

	[MaxLength(500)]
	[field: CompilerGenerated]
		public string? Description
	{
		[CompilerGenerated]
		get;
		[CompilerGenerated]
		set;
	}
}

