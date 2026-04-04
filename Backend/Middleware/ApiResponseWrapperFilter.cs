using System;
using System.Threading.Tasks;
using EcommerceAI.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace EcommerceAI.Middleware;

public class ApiResponseWrapperFilter : IAsyncResultFilter
{
    public async Task OnResultExecutionAsync(ResultExecutingContext context, ResultExecutionDelegate next)
    {
        if (context.Result is ObjectResult objectResult)
        {
            if (objectResult.Value is null)
            {
                objectResult.Value = ApiResponse<object>.SuccessResponse(null);
            }
            else if (!IsAlreadyWrapped(objectResult.Value))
            {
                objectResult.Value = ApiResponse<object>.SuccessResponse(objectResult.Value);
            }
        }

        await next();
    }

    private static bool IsAlreadyWrapped(object value)
    {
        var type = value.GetType();
        return type.IsGenericType && type.GetGenericTypeDefinition() == typeof(ApiResponse<>);
    }
}
