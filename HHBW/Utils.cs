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

        private T? GetGoogleServiceAsync<T>()
        {
            try
            {
                ConvertBinaryToText("credentials.jbin", "../../BethanySDAWebsite_credentials.json");
                var credential = GoogleCredential.FromFile("../../BethanySDAWebsite_credentials.json");
                if (typeof(T).Equals(typeof(DriveService)))
                    credential = credential.CreateScoped(DriveService.Scope.Drive, DriveService.Scope.DriveFile, DriveService.Scope.DriveMetadata);
                else if (typeof(T).Equals(typeof(YouTubeService)))
                    credential = credential.CreateScoped(YouTubeService.Scope.Youtube, YouTubeService.Scope.YoutubeUpload);

                var initializer = new BaseClientService.Initializer()
                {
                    ApplicationName = "bethany-sda-website",
                    HttpClientInitializer = credential

                };
                return (T)Activator.CreateInstance(typeof(T), initializer);
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex);
                return default;
            }
        }
        public async Task<string> GetImageFromDrive(string fileId)
        {
            string ImageFolder = Path.Combine(_webHostEnvironment.WebRootPath, "img", "bethany_images");
            Directory.CreateDirectory(ImageFolder);

        // check if File exist in the image folder            
        get_the_file:
            if (System.IO.File.Exists(Path.Combine(ImageFolder, $"{fileId}.png")))
            {
                return Path.Combine(ImageFolder.Replace($"{_webHostEnvironment.WebRootPath}\\", string.Empty), $"{fileId}.png").Replace("\\", "/");
            }

            try
            {
                var service = GetGoogleServiceAsync<DriveService>();

                if (service == null)
                {
                    throw new InvalidOperationException("Failed to create Google Drive service.");
                }

                // Define request parameters to get the file metadata
                var request = service.Files.Get(fileId);
                request.Fields = "id, name, mimeType, webViewLink, webContentLink";

                // Execute the request and get the file metadata
                var file = await request.ExecuteAsync();

                // Check if the file is an image
                if (file.MimeType.StartsWith("image/"))
                {
                    // Step 1: Make the file publicly accessible
                    var permission = new Permission
                    {
                        Role = "reader",
                        Type = "anyone"
                    };
                    var permissionRequest = service.Permissions.Create(permission, file.Id);
                    await permissionRequest.ExecuteAsync();

                    // Step 2: Generate a public link to the image
                    
                    string fullPath = Path.Combine(ImageFolder, $"{file.Id}.png");

                    // Download the file content
                    using (var memoryStream = new MemoryStream())
                    {
                        await request.DownloadAsync(memoryStream);
                        await System.IO.File.WriteAllBytesAsync(fullPath, memoryStream.ToArray());
                    }
                    goto get_the_file;
                }
                return string.Empty;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return string.Empty;
            }
        }
    }
}
