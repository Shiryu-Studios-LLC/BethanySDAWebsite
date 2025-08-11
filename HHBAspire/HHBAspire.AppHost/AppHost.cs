using Aspire.Hosting;

var builder = DistributedApplication.CreateBuilder(args);

// define a secret parameter with a default value you control
var postgres = builder.AddPostgres("postgres", port: 52297)
    .WithPgAdmin()
    .WithDataVolume();
var postgresdb = postgres.AddDatabase("bethanydb");

var cache = builder.AddRedis("cache");

var apiService = builder.AddProject<Projects.HHBAspire_ApiService>("apiservice")
    .WithReference(postgresdb)
    .WaitFor(postgresdb)
    .WithHttpHealthCheck("/health");

builder.AddProject<Projects.HHBAspire_Web>("webfrontend")
    .WithExternalHttpEndpoints()
    .WithHttpHealthCheck("/health")
    .WithReference(cache)
    .WaitFor(cache)
    .WithReference(apiService)
    .WaitFor(apiService);

builder.Build().Run();
