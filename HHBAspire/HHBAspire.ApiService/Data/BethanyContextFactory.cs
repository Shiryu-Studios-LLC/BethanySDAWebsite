using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using HHBAspire.ApiService.Data;

namespace HHBAspire.ApiService.Data;

public sealed class BethanyContextFactory : IDesignTimeDbContextFactory<BethanyDataContext>
{
    public BethanyDataContext CreateDbContext(string[] args)
    {
        // 1) Try Aspire-style env var: ConnectionStrings__bethanydb
        var cs = Environment.GetEnvironmentVariable("ConnectionStrings__bethanydb");

        // 2) Fallback for design-time (your fixed port/password from AppHost)
        if (string.IsNullOrWhiteSpace(cs))
        {
            cs = "Host=localhost;Port=52297;Database=bethanydb;Username=postgres;Password=7f6v3cAhSKK5N6MXuA)7}d";
        }

        var options = new DbContextOptionsBuilder<BethanyDataContext>()
            .UseNpgsql(cs)
            .Options;

        return new BethanyDataContext(options);
    }
}