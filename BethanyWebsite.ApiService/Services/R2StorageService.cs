using Amazon.S3;
using Amazon.S3.Model;
using Amazon.Runtime;

namespace BethanyWebsite.ApiService.Services;

public interface IR2StorageService
{
    Task<string> UploadFileAsync(Stream fileStream, string fileName, string contentType, string? folder = null);
    Task<Stream> DownloadFileAsync(string fileKey);
    Task<bool> DeleteFileAsync(string fileKey);
    Task<List<string>> ListFilesAsync(string? prefix = null);
    string GetPublicUrl(string fileKey);
}

public class R2StorageService : IR2StorageService
{
    private readonly IAmazonS3 _s3Client;
    private readonly string _bucketName;
    private readonly string? _publicDomain;
    private readonly ILogger<R2StorageService> _logger;

    public R2StorageService(
        IAmazonS3 s3Client,
        IConfiguration configuration,
        ILogger<R2StorageService> logger)
    {
        _s3Client = s3Client;
        _bucketName = configuration["R2:BucketName"]
            ?? throw new InvalidOperationException("R2:BucketName not configured");
        _publicDomain = configuration["R2:PublicDomain"];
        _logger = logger;
    }

    public async Task<string> UploadFileAsync(Stream fileStream, string fileName, string contentType, string? folder = null)
    {
        try
        {
            // Generate a unique file key
            var fileExtension = Path.GetExtension(fileName);
            var fileNameWithoutExt = Path.GetFileNameWithoutExtension(fileName);
            var timestamp = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
            var fileKey = folder != null
                ? $"{folder}/{fileNameWithoutExt}_{timestamp}{fileExtension}"
                : $"{fileNameWithoutExt}_{timestamp}{fileExtension}";

            var request = new PutObjectRequest
            {
                BucketName = _bucketName,
                Key = fileKey,
                InputStream = fileStream,
                ContentType = contentType,
                // Make objects publicly readable if you have a public domain configured
                CannedACL = _publicDomain != null ? S3CannedACL.PublicRead : S3CannedACL.Private
            };

            var response = await _s3Client.PutObjectAsync(request);

            if (response.HttpStatusCode == System.Net.HttpStatusCode.OK)
            {
                _logger.LogInformation("File uploaded successfully: {FileKey}", fileKey);
                return fileKey;
            }

            throw new Exception($"Failed to upload file. Status code: {response.HttpStatusCode}");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error uploading file: {FileName}", fileName);
            throw;
        }
    }

    public async Task<Stream> DownloadFileAsync(string fileKey)
    {
        try
        {
            var request = new GetObjectRequest
            {
                BucketName = _bucketName,
                Key = fileKey
            };

            var response = await _s3Client.GetObjectAsync(request);
            var memoryStream = new MemoryStream();
            await response.ResponseStream.CopyToAsync(memoryStream);
            memoryStream.Position = 0;

            _logger.LogInformation("File downloaded successfully: {FileKey}", fileKey);
            return memoryStream;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error downloading file: {FileKey}", fileKey);
            throw;
        }
    }

    public async Task<bool> DeleteFileAsync(string fileKey)
    {
        try
        {
            var request = new DeleteObjectRequest
            {
                BucketName = _bucketName,
                Key = fileKey
            };

            var response = await _s3Client.DeleteObjectAsync(request);

            _logger.LogInformation("File deleted successfully: {FileKey}", fileKey);
            return response.HttpStatusCode == System.Net.HttpStatusCode.NoContent;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting file: {FileKey}", fileKey);
            throw;
        }
    }

    public async Task<List<string>> ListFilesAsync(string? prefix = null)
    {
        try
        {
            var request = new ListObjectsV2Request
            {
                BucketName = _bucketName,
                Prefix = prefix
            };

            var response = await _s3Client.ListObjectsV2Async(request);
            var fileKeys = response.S3Objects.Select(obj => obj.Key).ToList();

            _logger.LogInformation("Listed {Count} files with prefix: {Prefix}", fileKeys.Count, prefix ?? "none");
            return fileKeys;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error listing files with prefix: {Prefix}", prefix);
            throw;
        }
    }

    public string GetPublicUrl(string fileKey)
    {
        if (!string.IsNullOrEmpty(_publicDomain))
        {
            return $"{_publicDomain}/{fileKey}";
        }

        // If no public domain is configured, return a presigned URL valid for 1 hour
        var request = new GetPreSignedUrlRequest
        {
            BucketName = _bucketName,
            Key = fileKey,
            Expires = DateTime.UtcNow.AddHours(1)
        };

        return _s3Client.GetPreSignedURL(request);
    }
}
