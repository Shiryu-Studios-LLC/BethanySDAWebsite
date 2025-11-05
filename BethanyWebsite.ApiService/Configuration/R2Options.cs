namespace BethanyWebsite.ApiService.Configuration;

public class R2Options
{
    public const string R2 = "R2";

    public string AccessKeyId { get; set; } = string.Empty;
    public string SecretAccessKey { get; set; } = string.Empty;
    public string AccountId { get; set; } = string.Empty;
    public string BucketName { get; set; } = string.Empty;
    public string? PublicDomain { get; set; }

    public string GetEndpointUrl() => $"https://{AccountId}.r2.cloudflarestorage.com";
}
