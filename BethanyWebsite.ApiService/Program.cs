using Amazon.S3;
using Amazon.Runtime;
using BethanyWebsite.ApiService.Configuration;
using BethanyWebsite.ApiService.Services;

var builder = WebApplication.CreateBuilder(args);

// Add service defaults & Aspire client integrations.
builder.AddServiceDefaults();

// Add services to the container.
builder.Services.AddProblemDetails();

// Configure R2 (Cloudflare Object Storage)
var r2Options = builder.Configuration.GetSection(R2Options.R2).Get<R2Options>();
if (r2Options != null && !string.IsNullOrEmpty(r2Options.AccessKeyId))
{
    var r2Credentials = new BasicAWSCredentials(r2Options.AccessKeyId, r2Options.SecretAccessKey);
    var r2Config = new AmazonS3Config
    {
        ServiceURL = r2Options.GetEndpointUrl(),
        ForcePathStyle = true
    };

    builder.Services.AddSingleton<IAmazonS3>(new AmazonS3Client(r2Credentials, r2Config));
    builder.Services.AddSingleton<IR2StorageService, R2StorageService>();
}

// Configure CORS for Blazor WebAssembly client
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowBlazorClient", policy =>
    {
        policy.WithOrigins(
            "https://localhost:5001",  // Local WASM dev server
            "http://localhost:5000",    // Local WASM dev server (HTTP)
            "https://*.pages.dev"       // Cloudflare Pages preview/production
        )
        .SetIsOriginAllowedToAllowWildcardSubdomains()
        .AllowAnyMethod()
        .AllowAnyHeader()
        .AllowCredentials();
    });
});

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseExceptionHandler();

// Enable CORS
app.UseCors("AllowBlazorClient");

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

string[] summaries = ["Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"];

app.MapGet("/weatherforecast", () =>
{
    var forecast = Enumerable.Range(1, 5).Select(index =>
        new WeatherForecast
        (
            DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            Random.Shared.Next(-20, 55),
            summaries[Random.Shared.Next(summaries.Length)]
        ))
        .ToArray();
    return forecast;
})
.WithName("GetWeatherForecast");

// Media/Storage endpoints
app.MapPost("/api/media/upload", async (IFormFile file, string? folder, IR2StorageService storageService) =>
{
    if (file == null || file.Length == 0)
        return Results.BadRequest("No file uploaded");

    try
    {
        using var stream = file.OpenReadStream();
        var fileKey = await storageService.UploadFileAsync(stream, file.FileName, file.ContentType, folder);
        var publicUrl = storageService.GetPublicUrl(fileKey);

        return Results.Ok(new { fileKey, publicUrl, fileName = file.FileName, size = file.Length });
    }
    catch (Exception ex)
    {
        return Results.Problem($"Error uploading file: {ex.Message}");
    }
})
.WithName("UploadMedia")
.DisableAntiforgery(); // Required for file uploads

app.MapGet("/api/media/list", async (string? folder, IR2StorageService storageService) =>
{
    try
    {
        var files = await storageService.ListFilesAsync(folder);
        var fileList = files.Select(key => new
        {
            fileKey = key,
            publicUrl = storageService.GetPublicUrl(key),
            fileName = Path.GetFileName(key)
        });

        return Results.Ok(fileList);
    }
    catch (Exception ex)
    {
        return Results.Problem($"Error listing files: {ex.Message}");
    }
})
.WithName("ListMedia");

app.MapDelete("/api/media/{*fileKey}", async (string fileKey, IR2StorageService storageService) =>
{
    try
    {
        var success = await storageService.DeleteFileAsync(fileKey);
        return success ? Results.Ok() : Results.NotFound();
    }
    catch (Exception ex)
    {
        return Results.Problem($"Error deleting file: {ex.Message}");
    }
})
.WithName("DeleteMedia");

app.MapGet("/api/media/url/{*fileKey}", (string fileKey, IR2StorageService storageService) =>
{
    try
    {
        var publicUrl = storageService.GetPublicUrl(fileKey);
        return Results.Ok(new { fileKey, publicUrl });
    }
    catch (Exception ex)
    {
        return Results.Problem($"Error getting file URL: {ex.Message}");
    }
})
.WithName("GetMediaUrl");

app.MapDefaultEndpoints();

app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}
