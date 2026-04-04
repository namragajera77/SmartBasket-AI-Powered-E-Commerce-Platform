using System;
using System.Collections.Generic;
using System.Text.Json;
using System.Threading.Tasks;
using EcommerceAI.DTOs;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace EcommerceAI.Middleware;

public class ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
{
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase
    };

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await next(context);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Unhandled exception while processing request.");
            await WriteErrorResponseAsync(context, ex);
        }
    }

    private static async Task WriteErrorResponseAsync(HttpContext context, Exception ex)
    {
        var (statusCode, errorCode) = ex switch
        {
            KeyNotFoundException => (StatusCodes.Status404NotFound, "NotFound"),
            UnauthorizedAccessException => (StatusCodes.Status401Unauthorized, "Unauthorized"),
            ArgumentException => (StatusCodes.Status400BadRequest, "BadRequest"),
            InvalidOperationException => (StatusCodes.Status400BadRequest, "BadRequest"),
            HttpRequestException => (StatusCodes.Status502BadGateway, "BadGateway"),
            _ => (StatusCodes.Status500InternalServerError, "ServerError")
        };

        context.Response.ContentType = "application/json";
        context.Response.StatusCode = statusCode;

        var message = statusCode == StatusCodes.Status500InternalServerError
            ? "An unexpected server error occurred."
            : ex.Message;

        var payload = JsonSerializer.Serialize(
            ApiResponse<object>.ErrorResponse(errorCode, message),
            JsonOptions);

        await context.Response.WriteAsync(payload);
    }
}
