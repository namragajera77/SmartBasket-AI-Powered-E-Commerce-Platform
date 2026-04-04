using System;
using System.Diagnostics;
using System.Runtime.CompilerServices;

namespace EcommerceAI.DTOs;

public class ProductQueryParametersDTO
{
	private const int MaxPageSize = 100;

	private int _page = 1;

	private int _pageSize = 10;

	public int Page
	{
		get
		{
			return _page;
		}
		set
		{
			_page = ((value < 1) ? 1 : value);
		}
	}

	public int PageSize
	{
		get
		{
			return _pageSize;
		}
		set
		{
			_pageSize = ((value < 1) ? 10 : Math.Min(value, 100));
		}
	}

	[field: CompilerGenerated]
		public int? CategoryId
	{
		[CompilerGenerated]
		get;
		[CompilerGenerated]
		set;
	}

	[field: CompilerGenerated]
		public decimal? MinPrice
	{
		[CompilerGenerated]
		get;
		[CompilerGenerated]
		set;
	}

	[field: CompilerGenerated]
		public decimal? MaxPrice
	{
		[CompilerGenerated]
		get;
		[CompilerGenerated]
		set;
	}

	[field: CompilerGenerated]
		public string? SortBy
	{
		[CompilerGenerated]
		get;
		[CompilerGenerated]
		set;
	}
}

