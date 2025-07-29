using System.Globalization;

//Include Google api 
using Google.Apis.Auth.OAuth2;
using Google.Apis.Drive.v3;
using Google.Apis.Services;
using Google.Apis.Drive.v3.Data;
using Google.Apis.YouTube.v3;
using Google.Apis.YouTube.v3.Data;
using System.Net;
using Microsoft.AspNetCore.DataProtection.KeyManagement;
using System.Reflection;
using Newtonsoft.Json;
using Microsoft.AspNetCore.Hosting;
using System.Runtime.Serialization.Formatters.Binary;
using System.Text;
using Google.Apis.Http;
using Google.Apis.Util.Store;
using System.Runtime.InteropServices;
using System.Runtime.Versioning;

namespace HHBW
{
    public class Utils
    {
        private readonly IConfiguration _configuration;
        private readonly IWebHostEnvironment _webHostEnvironment;
        
        // Constructor with dependency injection for IConfiguration
        public Utils(IConfiguration configuration, IWebHostEnvironment webHostEnvironment)
        {
            _configuration = configuration;
            _webHostEnvironment = webHostEnvironment;
        }

        private const byte ObfuscationKey = 0xAA; // Example key for XOR operation

        public JsonSerializerSettings JsonSettings => new JsonSerializerSettings
        {
            Formatting = Formatting.Indented
        };

        public void ConvertTextToBinary(string inputFilePath, string outputFilePath)
        {
            // Read the text from the file
            string text = System.IO.File.ReadAllText(inputFilePath);

            // Convert the text to bytes using a specific encoding (e.g., UTF8)
            byte[] textBytes = Encoding.UTF8.GetBytes(text);

            // Obfuscate the bytes using XOR operation
            for (int i = 0; i < textBytes.Length; i++)
            {
                textBytes[i] ^= ObfuscationKey;
            }

            // Write the obfuscated bytes to a binary file
            System.IO.File.WriteAllBytes(outputFilePath, textBytes);

            Console.WriteLine($"Text file converted to obfuscated binary and saved to {outputFilePath}");
        }
        public void ConvertBinaryToText(string inputFilePath, string outputFilePath)
        {
            // Read the binary data from the file
            byte[] binaryData = System.IO.File.ReadAllBytes(inputFilePath);

            // De-obfuscate the bytes using XOR operation
            for (int i = 0; i < binaryData.Length; i++)
            {
                binaryData[i] ^= ObfuscationKey;
            }

            // Convert the de-obfuscated bytes back to a string using the same encoding (e.g., UTF8)
            string text = Encoding.UTF8.GetString(binaryData);

            // Write the string back to a text file
            System.IO.File.WriteAllText(outputFilePath, text);

            Console.WriteLine($"Obfuscated binary file converted back to text and saved to {outputFilePath}");
        }

        private async Task<T?> GetGoogleServiceAsync<T>()
        {
            var applicationName = "bethany-sda-website";
            try
            {
                if (typeof(T).Equals(typeof(DriveService)))
                {
                    var credential = GetCredentialsFromServiceAccountFile();
                    credential = credential.CreateScoped(DriveService.Scope.Drive, DriveService.Scope.DriveFile, DriveService.Scope.DriveMetadata);
                    return (T)Activator.CreateInstance(typeof(T), new BaseClientService.Initializer()
                    {
                        ApplicationName = applicationName,
                        HttpClientInitializer = credential

                    });
                }
                else if (typeof(T).Equals(typeof(YouTubeService)))
                {
                    var credential = await GetCredentialFromOAuth2File(Scopes: YouTubeService.Scope.YoutubeReadonly);
                    return (T)Activator.CreateInstance(typeof(T), new BaseClientService.Initializer()
                    {
                        ApplicationName = applicationName,
                        HttpClientInitializer = credential

                    });
                }
                return default;
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex);
                return default;
            }
        }

        private GoogleCredential GetCredentialsFromServiceAccountFile()
        {
            ConvertBinaryToText(_configuration.GetSection("GoogleAuth").GetValue<string>("GoogleServiceAccountBinary"), _configuration.GetSection("GoogleAuth").GetValue<string>("GoogleServiceAccountJson"));
            return GoogleCredential.FromFile(_configuration.GetSection("GoogleAuth").GetValue<string>("GoogleServiceAccountJson"));
        }
        private async Task<UserCredential> GetCredentialFromOAuth2File(params string[] Scopes)
        {
            ConvertBinaryToText(_configuration.GetSection("GoogleAuth").GetValue<string>("GoogleOAuthBinary"), _configuration.GetSection("GoogleAuth").GetValue<string>("GoogleOAuthJson"));
            using (var stream = new FileStream(_configuration.GetSection("GoogleAuth").GetValue<string>("GoogleOAuthJson"), FileMode.Open, FileAccess.Read))
            {
                return await GoogleWebAuthorizationBroker.AuthorizeAsync(
                    GoogleClientSecrets.Load(stream).Secrets,
                    Scopes,
                    "user",
                    CancellationToken.None,
                    new FileDataStore(this.GetType().ToString())
                );
            }
        }

        public async Task<SiteInfo> SaveSiteInfoAsync(SiteInfo _SiteInfo)
        {
            if (System.IO.File.Exists(_configuration.GetValue<string>("SiteInfoFile")))
                System.IO.File.Delete(_configuration.GetValue<string>("SiteInfoFile"));
            var json = JsonConvert.SerializeObject(_SiteInfo, JsonSettings);
            await System.IO.File.WriteAllTextAsync(_configuration.GetValue<string>("SiteInfoFile"), json);
            return _SiteInfo;
        }
        public async Task<SiteInfo?> LoadSiteInfoAsync()
        {
            var json = default(string);
            var siteinfo = default(SiteInfo);
            var _siteFile = _configuration.GetValue<string>("SiteInfoFile");
            try
            {
                if (!System.IO.File.Exists(_siteFile))
                {
                    siteinfo = SiteManager.GetDefaultSiteInfo();                    
                    await SaveSiteInfoAsync(siteinfo);
                }
                else
                {
                    json = await System.IO.File.ReadAllTextAsync(_siteFile);
                    siteinfo = JsonConvert.DeserializeObject<SiteInfo>(json, JsonSettings);
                }
            }
            catch(Exception ex)
            {
                siteinfo = new SiteInfo();
                await SaveSiteInfoAsync(siteinfo);
                Console.WriteLine(ex);

            }
            return siteinfo;
        }

        //img/bethany_images/upcomingevents.png

        public async Task<string> GetImageFromDriveAsync(string fileId)
        {
            string imageFolder = Path.Combine(_webHostEnvironment.WebRootPath, "img", "bethany_images");
            Directory.CreateDirectory(imageFolder);

            string fileName = $"{fileId}.png";
            string fullFilePath = Path.Combine(imageFolder, fileName);

            if (System.IO.File.Exists(fullFilePath))
            {
                return GetPlatformLocation(fullFilePath, pretty: true);
            }

            try
            {
                var service = await GetGoogleServiceAsync<DriveService>();

                if (service == null)
                {
                    throw new InvalidOperationException("Failed to create Google Drive service.");
                }

                var request = service.Files.Get(fileId);
                request.Fields = "id, name, mimeType, webViewLink, webContentLink";

                var file = await request.ExecuteAsync();

                if (file.MimeType.StartsWith("image/"))
                {
                    var permission = new Google.Apis.Drive.v3.Data.Permission
                    {
                        Role = "reader",
                        Type = "anyone"
                    };
                    await service.Permissions.Create(permission, file.Id).ExecuteAsync();

                    using (var memoryStream = new MemoryStream())
                    {
                        await request.DownloadAsync(memoryStream);
                        await System.IO.File.WriteAllBytesAsync(fullFilePath, memoryStream.ToArray());
                    }

                    // File is downloaded, return the relative path
                    return GetPlatformLocation(fullFilePath, pretty: true);
                }

                return string.Empty;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return string.Empty;
            }
        }

        private string GetPlatformLocation(string filePath, bool pretty = false)
        {
            if (pretty)
            {
                // Return a relative URL path for the web
                var relativePath = Path.GetRelativePath(_webHostEnvironment.WebRootPath, filePath);
                return relativePath.Replace("\\", "/"); // Web URLs use forward slashes
            }
            else
            {
                // Normalize to platform-specific file system path
                return filePath.Replace("/", Path.DirectorySeparatorChar.ToString())
                               .Replace("\\", Path.DirectorySeparatorChar.ToString());
            }
        }


        public async Task<List<LiveBroadcast>?> GetPreviousLiveStreamsAsync(string channelId)
        {
            try
            {
                var service = await GetGoogleServiceAsync<YouTubeService>();

                if (service == null)
                {
                    throw new InvalidOperationException("Failed to create Google Youtube service.");
                }

                var liveBroadcastRequest = service.LiveBroadcasts.List("snippet,contentDetails,status");
                liveBroadcastRequest.BroadcastStatus = LiveBroadcastsResource.ListRequest.BroadcastStatusEnum.Completed;
                liveBroadcastRequest.BroadcastType = LiveBroadcastsResource.ListRequest.BroadcastTypeEnum.Event__;
                liveBroadcastRequest.MaxResults = 50;  // Number of results to return
                //liveBroadcastRequest.ChannelId = channelId;

                var liveBroadcastResponse = await liveBroadcastRequest.ExecuteAsync();
                return liveBroadcastResponse.Items as List<LiveBroadcast>;
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex);
                return default;
            }
        }


        public string GetLanguageId(Languages language)
        {
            var index = (int)language;
            return $"change-lang-opt{index}";
        }
    }
}
