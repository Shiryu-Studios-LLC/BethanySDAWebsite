using Microsoft.EntityFrameworkCore;
using HHBAspire.ApiService.Data;

namespace HHBAspire.ApiService.Endpoints;

public static class SiteInfoEndpoints
{
    public static void MapSiteInfo(this IEndpointRouteBuilder app)
    {
        var site = app.MapGroup("/siteinfo");

        site.MapGet("/basicinfo", async (BethanyDataContext db, CancellationToken ct) =>
            await db.SiteInfos.Select(s => s.Info).FirstOrDefaultAsync(ct) is var info && info != null
                ? Results.Ok(info)
                : Results.NotFound());

        site.MapGet("/thumbnailinfo", async (BethanyDataContext db, CancellationToken ct) =>
            await db.SiteInfos.Select(s => s.Thumbnails).FirstOrDefaultAsync(ct) is var info && info != null
                ? Results.Ok(info)
                : Results.NotFound());

        site.MapGet("/slides", async (BethanyDataContext db, CancellationToken ct) =>
            Results.Ok(await db.Slides.ToListAsync(ct)));

        site.MapGet("/services", async (BethanyDataContext db, CancellationToken ct) =>
            Results.Ok(await db.Services.ToListAsync(ct)));

        site.MapGet("/team", async (BethanyDataContext db, CancellationToken ct) =>
            Results.Ok(await db.TeamMembers.ToListAsync(ct)));

        site.MapGet("/news", async (BethanyDataContext db, CancellationToken ct) =>
            Results.Ok(await db.News.OrderByDescending(n => n.DateTime).ToListAsync(ct)));

        site.MapGet("/ministries", async (BethanyDataContext db, CancellationToken ct) =>
            Results.Ok(await db.Ministries.ToListAsync(ct)));
    }
}
