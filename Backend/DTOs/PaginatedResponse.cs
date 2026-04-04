using System;
using System.Collections.Generic;
using System.Runtime.CompilerServices;

namespace EcommerceAI.DTOs;

public class PaginatedResponse<T>
{
	public int Page
	{
		[CompilerGenerated]
		get;
		[CompilerGenerated]
		set;
	}

	public int PageSize
	{
		[CompilerGenerated]
		get;
		[CompilerGenerated]
		set;
	}

	public int TotalItems
	{
		[CompilerGenerated]
		get;
		[CompilerGenerated]
		set;
	}

	public System.Collections.Generic.IEnumerable<T> Items
	{
		[CompilerGenerated]
		get;
		[CompilerGenerated]
		set;
	} = System.Array.Empty<T>();
}
