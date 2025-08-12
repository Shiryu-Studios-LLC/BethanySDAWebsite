using Aspire.Hosting;
using System.IO;

var builder = DistributedApplication.CreateBuilder(args);

// Persist MinIO data
var dataDir = Path.Combine(builder.AppHostDirectory, "data", "minio");
Directory.CreateDirectory(dataDir);

// --- Redis cache ---
// Add Redis (Aspire’s helper models the container & exposes a connection string)
var redis = builder.AddRedis("cache"); // shows up in the dashboard

// --- MinIO server (per docs: S3 on :9000, Console on :9001) ---
var minio = builder.AddContainer("minio", "minio/minio", "latest")
    .WithEnvironment("MINIO_ROOT_USER", "minioadmin")
    .WithEnvironment("MINIO_ROOT_PASSWORD", "minioadmin123!")
    // Use a named volume so you don't write to your host path:
    .WithVolume("minio-data", "/data")
    .WithArgs("server", "/data", "--console-address", ":9001")
    .WithHttpEndpoint(name: "s3", port: 9000, targetPort: 9000)   // API
    .WithHttpEndpoint(name: "console", port: 9001, targetPort: 9001)   // Web UI
    .WithHttpHealthCheck(path: "/minio/health/ready", endpointName: "s3");

var postgress_user = builder.AddParameter("POSTGRESSUSER", "postgres");
var postgress_pass = builder.AddParameter("POSTGRESSPASS", "postgress123!", secret: true);

var postgres = builder.AddPostgres("postgres")
    .WithUserName(postgress_user)
    .WithPassword(postgress_pass)
    .WithPgAdmin()
    .WithHostPort(52297)
    .WithVolume("bethany-data", "/data");
var postgresdb = postgres.AddDatabase("bethanydb");

var api = builder.AddProject<Projects.BethanyWebsite_ApiService>("api")
    .WithHttpHealthCheck("/health")
    .WaitFor(postgresdb) 
    .WithReference(postgresdb); 

// Your web app
var web = builder.AddProject<Projects.BethanyWebsite_Web>("webfrontend")
    .WithExternalHttpEndpoints()
    .WithHttpHealthCheck("/health")
    .WaitFor(api)
    .WithReference(api)
    .WaitFor(redis)
    .WaitFor(minio)
    .WithEnvironment("Minio__Endpoint", "http://localhost:9000")
    .WithEnvironment("Minio__Console", "http://localhost:9001")
     .WithEnvironment("Minio__AccessKey", "webapp")
    .WithEnvironment("Minio__SecretKey", "<the-long-secret>")
    .WithReference(redis);

builder.Build().Run();
