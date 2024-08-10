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

namespace HHBW
{
    public class Utils
    {
        private readonly IConfiguration _configuration;

        // Constructor with dependency injection for IConfiguration
        public Utils(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        private T? GetGoogleService<T>()
        {
            var credential = GoogleCredential.FromFile("credentials.json");
            var initializer = new BaseClientService.Initializer()
            {
                HttpClientInitializer = credential,
                ApplicationName = "Bethany SDA Website"
            };
            T? service = default;
            if (typeof(T).Equals(typeof(DriveService)))
            {
                credential.CreateScoped(DriveService.Scope.Drive);
                service = (T)(object)new DriveService(initializer);
            }
            
            return service;
        }

        public async Task<string> GetImageFromDrive(string fileId)
        {
            try
            {
                var service = GetGoogleService<DriveService>();                
                // Define request parameters to get the file metadata
                var request = service.Files.Get(fileId);
                request.Fields = "id, name, mimeType, webContentLink";

                // Execute the request and get the file metadata
                var file = await request.ExecuteAsync();

                // Check if the file is an image
                if (file.MimeType.StartsWith("image/"))
                {
                    // Google Drive's direct download link format
                    string downloadUrl = $"https://drive.google.com/uc?export=download&id={file.Id}";
                    return downloadUrl;
                }
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex);
                return string.Empty;
            }
            return string.Empty;
        }
    }
}
