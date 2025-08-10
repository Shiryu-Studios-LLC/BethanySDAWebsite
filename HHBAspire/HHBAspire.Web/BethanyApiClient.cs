using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.Extensions.Caching.Distributed;
using HHBAspire.Shared.Data;

namespace HHBAspire.Web.Services;

public class BethanyApiClient
{
    private readonly HttpClient _http;
    private readonly IDistributedCache _cache;
    private static readonly JsonSerializerOptions _json = new(JsonSerializerDefaults.Web);

    public BethanyApiClient(HttpClient http, IDistributedCache cache)
    {
        _http = http;
        _cache = cache;
    }

    private async Task<T?> GetOrSetAsync<T>(string key, string path, TimeSpan duration, CancellationToken ct)
    {
        var cached = await _cache.GetStringAsync(key, ct);
        if (!string.IsNullOrWhiteSpace(cached))
            return JsonSerializer.Deserialize<T>(cached, _json);

        var result = await _http.GetFromJsonAsync<T>(path, _json, ct);
        if (result is null) return default;

        await _cache.SetStringAsync(key, JsonSerializer.Serialize(result, _json),
            new DistributedCacheEntryOptions { AbsoluteExpirationRelativeToNow = duration }, ct);
        return result;
    }

    public Task<BasicInfoObject?> GetBasicInfoAsync(CancellationToken ct = default) =>
        GetOrSetAsync<BasicInfoObject>("siteinfo:basicinfo", "/siteinfo/basicinfo", TimeSpan.FromMinutes(5), ct);

    public Task<List<SlideObject>?> GetSlidesAsync(CancellationToken ct = default) =>
        GetOrSetAsync<List<SlideObject>>("siteinfo:slides", "/siteinfo/slides", TimeSpan.FromMinutes(2), ct);

    public Task<List<ServiceObject>?> GetServicesAsync(CancellationToken ct = default) =>
        GetOrSetAsync<List<ServiceObject>>("siteinfo:services", "/siteinfo/services", TimeSpan.FromMinutes(2), ct);

    public Task<List<TeamMemberObject>?> GetTeamAsync(CancellationToken ct = default) =>
        GetOrSetAsync<List<TeamMemberObject>>("siteinfo:team", "/siteinfo/team", TimeSpan.FromMinutes(2), ct);

    public Task<List<NewsObject>?> GetNewsAsync(CancellationToken ct = default) =>
        GetOrSetAsync<List<NewsObject>>("siteinfo:news", "/siteinfo/news", TimeSpan.FromMinutes(2), ct);

    public Task<List<MinistryObject>?> GetMinistriesAsync(CancellationToken ct = default) =>
        GetOrSetAsync<List<MinistryObject>>("siteinfo:ministries", "/siteinfo/ministries", TimeSpan.FromMinutes(5), ct);
}
