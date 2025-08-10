using HHBAspire.ApiService.Data;
using HHBAspire.ApiService.Endpoints;

var builder = WebApplication.CreateBuilder(args);

// Add service defaults & Aspire client integrations.
builder.AddServiceDefaults();

builder.AddNpgsqlDbContext<BethanyDataContext>("bethanydb");

// Add services to the container.
builder.Services.AddProblemDetails();

builder.Services.AddEndpointsApiExplorer(); // Needed for Swagger
builder.Services.AddSwaggerGen();

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();
app.MapGet("/health", () => Results.Ok("OK"));
app.MapSiteInfo(); // cleanly registers all /siteinfo/* routes

// Configure the HTTP request pipeline.
app.UseExceptionHandler();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwaggerUI(); // optional if you like the UI
}

app.MapDefaultEndpoints();

app.CreateDbIfNotExist();

app.Run();