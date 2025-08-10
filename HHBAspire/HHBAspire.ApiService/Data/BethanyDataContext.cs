using System;
using Microsoft.EntityFrameworkCore;

namespace HHBAspire.ApiService.Data;

public class BethanyDataContext : DbContext
{
    public BethanyDataContext(DbContextOptions<BethanyDataContext> options) : base(options) { }

    public DbSet<SiteInfo> SiteInfos { get; set; }
    public DbSet<SlideObject> Slides { get; set; }
    public DbSet<ServiceObject> Services { get; set; }
    public DbSet<TeamMemberObject> TeamMembers { get; set; }
    public DbSet<NewsObject> News { get; set; }
    public DbSet<MinistryObject> Ministries { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(BethanyDataContext).Assembly);
        base.OnModelCreating(modelBuilder);
    }
}

public static class Extentions
{
    public static void CreateDbIfNotExist(this IHost host)
    {
        using var scope = host.Services.CreateScope();

        var services = scope.ServiceProvider;
        var context = services.GetRequiredService<BethanyDataContext>();
        try
        {
            context.Database.EnsureCreated();
            DbInitializer.Initialize(context);
        }
        catch (Exception ex)
        {
            
        }
    }
}
