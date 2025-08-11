using System;
using Microsoft.EntityFrameworkCore;
using HHBAspire.Shared.Data;

namespace HHBAspire.ApiService.Data;

public class BethanyDataContext : DbContext
{
    public BethanyDataContext(DbContextOptions<BethanyDataContext> options) : base(options) { }

    public DbSet<SiteInfo> SiteInfos => Set<SiteInfo>();
    public DbSet<SlideObject> Slides => Set<SlideObject>();
    public DbSet<ServiceObject> Services => Set<ServiceObject>();
    public DbSet<TeamMemberObject> TeamMembers => Set<TeamMemberObject>();
    public DbSet<NewsObject> News => Set<NewsObject>();
    public DbSet<MinistryObject> Ministries => Set<MinistryObject>();
    public DbSet<ThumbnailObject> Thumbnails => Set<ThumbnailObject>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(BethanyDataContext).Assembly);

        // Root aggregate
        modelBuilder.Entity<SiteInfo>(b =>
        {
            b.HasKey(s => s.Id);

            // Owned value objects live in SiteInfos table
            b.OwnsOne(s => s.Info);
            b.OwnsOne(s => s.Api);

            // Required one-to-manys (per-site data)
            b.HasMany(s => s.Thumbnails).WithOne(t => t.SiteInfo).HasForeignKey(t => t.SiteInfoId).IsRequired().OnDelete(DeleteBehavior.Cascade);
            b.HasMany(s => s.Slides).WithOne(t => t.SiteInfo).HasForeignKey(t => t.SiteInfoId).IsRequired().OnDelete(DeleteBehavior.Cascade);
            b.HasMany(s => s.Services).WithOne(t => t.SiteInfo).HasForeignKey(t => t.SiteInfoId).IsRequired().OnDelete(DeleteBehavior.Cascade);
            b.HasMany(s => s.TeamMembers).WithOne(t => t.SiteInfo).HasForeignKey(t => t.SiteInfoId).IsRequired().OnDelete(DeleteBehavior.Cascade);
            b.HasMany(s => s.News).WithOne(t => t.SiteInfo).HasForeignKey(t => t.SiteInfoId).IsRequired().OnDelete(DeleteBehavior.Cascade);

            // ✅ FIX: this must be HasMany(...Ministries...), not HasOne(...)
            b.HasMany(s => s.Ministries).WithOne(m => m.SiteInfo).HasForeignKey(m => m.SiteInfoId).IsRequired().OnDelete(DeleteBehavior.Cascade);
        });

        // Self-referencing hierarchy for ministries (optional parent)
        modelBuilder.Entity<MinistryObject>(b =>
        {
            b.HasKey(m => m.Id);
            b.Property(m => m.Title).IsRequired();
            b.Property(m => m.SiteInfoId).IsRequired();

            // Optional parent -> children
            b.HasOne(m => m.Parent)
             .WithMany(p => p.Children)
             .HasForeignKey(m => m.ParentId)
             .OnDelete(DeleteBehavior.Restrict);

            b.HasIndex(m => new { m.SiteInfoId, m.ParentId });
        });

        // Helpful indexes
        modelBuilder.Entity<SlideObject>().HasIndex(x => new { x.SiteInfoId, x.Headline });
        modelBuilder.Entity<ThumbnailObject>().HasIndex(x => new { x.SiteInfoId, x.Type });
        modelBuilder.Entity<ServiceObject>().HasIndex(x => x.SiteInfoId);
        modelBuilder.Entity<TeamMemberObject>().HasIndex(x => x.SiteInfoId);

        // If your NewsObject uses PublishedUtc instead of DateTime, change this accordingly.
        modelBuilder.Entity<NewsObject>().HasIndex(x => new { x.SiteInfoId, x.DateTime });
        modelBuilder.Entity<MinistryObject>().HasIndex(x => x.SiteInfoId);
    }
}

public static class Extentions
{
    public static void CreateDbIfNotExist(this IHost host)
    {
        using var scope = host.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<BethanyDataContext>();

        try
        {
            context.Database.Migrate();
            DbInitializer.Initialize(context);
        }
        catch (Exception)
        {
            // consider logging
        }
    }
}
