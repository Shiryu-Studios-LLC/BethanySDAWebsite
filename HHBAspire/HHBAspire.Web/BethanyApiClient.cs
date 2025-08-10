using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.Extensions.Caching.Distributed;

namespace HHBAspire.Web;

public class BethanyApiClient
{
    private readonly HttpClient _http;
    private readonly IDistributedCache _cache;
    private static readonly JsonSerializerOptions _json = new(JsonSerializerDefaults.Web);

    // cache keys
    private const string BasicInfoKey = "siteinfo:basicinfo";

    // tune these as needed
    private static readonly DistributedCacheEntryOptions DefaultCache = new()
    {
        AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(2)
    };

    public BethanyApiClient(HttpClient httpClient, IDistributedCache cache)
    {
        _http = httpClient;
        _cache = cache;
    }

    // ---- BASIC INFO ----
    public async Task<BasicInfoObject?> GetBasicInfoAsync(CancellationToken ct = default)
    {
        // 1) try cache
        var cached = await _cache.GetStringAsync(BasicInfoKey, ct);
        if (!string.IsNullOrWhiteSpace(cached))
        {
            return JsonSerializer.Deserialize<BasicInfoObject>(cached, _json);
        }

        // 2) call API
        var result = await _http.GetFromJsonAsync<BasicInfoObject>("/siteinfo/basicinfo", _json, ct);
        if (result is null) return null;

        // 3) cache it
        var payload = JsonSerializer.Serialize(result, _json);
        await _cache.SetStringAsync(BasicInfoKey, payload, DefaultCache, ct);
        return result;
    }

    // OPTIONAL: if you want to force refresh (e.g., after admin edits)
    public async Task InvalidateBasicInfoAsync(CancellationToken ct = default)
        => await _cache.RemoveAsync(BasicInfoKey, ct);
}
