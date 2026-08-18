using System.Net;
using System.Text.Json;

namespace SportHub.Middleware
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionMiddleware> _logger;

        public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unhandled exception: {Message}", ex.Message);
                context.Response.ContentType = "application/json";

                var (statusCode, message) = ex switch
                {
                    KeyNotFoundException => ((int)HttpStatusCode.NotFound, ex.Message),
                    ArgumentException => ((int)HttpStatusCode.BadRequest, ex.Message),
                    InvalidOperationException => ((int)HttpStatusCode.Conflict, ex.Message),
                    UnauthorizedAccessException => ((int)HttpStatusCode.Forbidden, "Access denied."),
                    _ => ((int)HttpStatusCode.InternalServerError, "An unexpected error occurred. Please try again later.")
                };

                context.Response.StatusCode = statusCode;
                var response = new { message };
                var json = JsonSerializer.Serialize(response);
                await context.Response.WriteAsync(json);
            }
        }
    }
}
