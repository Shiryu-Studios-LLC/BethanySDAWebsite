using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Components.WebAssembly.Hosting;
using BethanyWebsite.Client;

var builder = WebAssemblyHostBuilder.CreateDefault(args);
builder.RootComponents.Add<App>("#app");
builder.RootComponents.Add<HeadOutlet>("head::after");

// Default HttpClient for static assets
builder.Services.AddScoped(sp => new HttpClient { BaseAddress = new Uri(builder.HostEnvironment.BaseAddress) });

// Named HttpClient for API calls
// For local development, configure the API URL in wwwroot/appsettings.json
// For Cloudflare Pages, this will be set via environment variables
var apiBaseUrl = builder.Configuration["ApiBaseUrl"] ?? "https://localhost:7032";
builder.Services.AddHttpClient("BethanyAPI", client =>
{
    client.BaseAddress = new Uri(apiBaseUrl);
});

await builder.Build().RunAsync();
