using Microsoft.Extensions.Primitives;
using Minio;                     // OK to keep even if unused (for future uploads)
using Minio.DataModel.Args;
using Minio.Exceptions;
using System.Net;

namespace BethanyWebsite.Web;

public static class Extensions
{
    public static WebApplication MapDefaultAdditionalEndpoints(this WebApplication app)
    {
        // AppHost should set Minio__Endpoint (e.g., http://localhost:9000)
        var minioEndpoint = app.Configuration["Minio:Endpoint"] ?? "http://localhost:9000";
        var baseUri = new Uri(minioEndpoint.TrimEnd('/'));

        // Reusable HttpClient for proxying GET/HEAD to MinIO
        var httpClient = new HttpClient { BaseAddress = baseUri };

        // Helper: safely encode path segments (spaces, unicode, etc.)
        static string EncodePath(string key) =>
            string.Join('/', key.Split('/', StringSplitOptions.RemoveEmptyEntries)
                                .Select(Uri.EscapeDataString));

        // ========= Multi-bucket proxy =========
        // e.g. /storage/media/uploads/2025/08/11/foo.jpg
        app.MapMethods("/storage/{bucket}/{**key}", new[] { "GET", "HEAD" },
            async (string bucket, string key, HttpContext ctx, CancellationToken ct) =>
            {
                var path = $"/{Uri.EscapeDataString(bucket)}/{EncodePath(key)}";
                using var forward = new HttpRequestMessage(new HttpMethod(ctx.Request.Method), path);

                // Forward range/conditional headers to upstream request
                foreach (var h in new[] { "Range", "If-None-Match", "If-Modified-Since", "If-Range", "If-Unmodified-Since" })
                    if (ctx.Request.Headers.TryGetValue(h, out StringValues val))
                        forward.Headers.TryAddWithoutValidation(h, (IEnumerable<string>)val);

                using var resp = await httpClient.SendAsync(forward, HttpCompletionOption.ResponseHeadersRead, ct);
                ctx.Response.StatusCode = (int)resp.StatusCode;

                // Copy headers from MinIO (drop hop-by-hop)
                foreach (var (k, v) in resp.Headers) ctx.Response.Headers[k] = v.ToArray();
                foreach (var (k, v) in resp.Content.Headers) ctx.Response.Headers[k] = v.ToArray();
                foreach (var hop in new[] { "transfer-encoding", "connection", "keep-alive", "proxy-authenticate", "proxy-authorization", "te", "trailer", "upgrade" })
                    ctx.Response.Headers.Remove(hop);

                if (HttpMethods.IsHead(ctx.Request.Method) || resp.StatusCode == HttpStatusCode.NotModified)
                    return;

                await resp.Content.CopyToAsync(ctx.Response.Body, ct);
            });

        // ========= Single-bucket proxy (bucket = "media") =========
        // e.g. /media/uploads/2025/08/11/foo.jpg
        // using Minio; using Minio.DataModel.Args;
        // using Minio;
        // using Minio.DataModel.Args;
        // using Minio.Exceptions;

        app.MapMethods("/media/{**key}", new[] { "GET", "HEAD" }, async (string key, HttpContext ctx, IMinioClient minio, CancellationToken ct) =>
        {
            try
            {
                var stat = await minio.StatObjectAsync(
                    new StatObjectArgs().WithBucket("media").WithObject(key), ct);

                // headers
                ctx.Response.ContentType = stat.ContentType ?? "application/octet-stream";
                if (!string.IsNullOrEmpty(stat.ETag)) ctx.Response.Headers.ETag = $"\"{stat.ETag}\"";
                if (stat.LastModified != null) ctx.Response.Headers.LastModified = stat.LastModified!.ToUniversalTime().ToString("R");
                ctx.Response.Headers["Accept-Ranges"] = "bytes";
                if (stat.Size >= 0) ctx.Response.ContentLength = stat.Size;

                // HEAD = headers only
                if (HttpMethods.IsHead(ctx.Request.Method))
                    return;

                // IMPORTANT: synchronous callback — do NOT use 'async' here
                await minio.GetObjectAsync(
                    new GetObjectArgs()
                        .WithBucket("media")
                        .WithObject(key)
                        .WithCallbackStream(stream =>
                        {
                            // Block until the copy finishes so MinIO doesn't dispose early
                            stream.CopyToAsync(ctx.Response.Body, ct).GetAwaiter().GetResult();
                        }),
                    ct);
            }
            catch (MinioException mex) when (mex.Message.Contains("NotFound", StringComparison.OrdinalIgnoreCase))
            {
                ctx.Response.StatusCode = StatusCodes.Status404NotFound;
            }
            catch (MinioException)
            {
                ctx.Response.StatusCode = StatusCodes.Status502BadGateway;
            }
        });

        return app;
    }
}