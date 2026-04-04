using System.Runtime.CompilerServices;

namespace EcommerceAI.DTOs;

public class ApiResponse<T>
{
	public bool Success
	{
		[CompilerGenerated]
		get;
		[CompilerGenerated]
		set;
	}

	public T? Data
	{
		[CompilerGenerated]
		get;
		[CompilerGenerated]
		set;
	}

	public string? Error
	{
		[CompilerGenerated]
		get;
		[CompilerGenerated]
		set;
	}

	public string? Message
	{
		[CompilerGenerated]
		get;
		[CompilerGenerated]
		set;
	}

	public static ApiResponse<T> SuccessResponse(T? data, string? message = null)
	{
		return new ApiResponse<T>
		{
			Success = true,
			Data = data,
			Message = message
		};
	}

	public static ApiResponse<T> ErrorResponse(string error, string message)
	{
		return new ApiResponse<T>
		{
			Success = false,
			Error = error,
			Message = message
		};
	}
}
