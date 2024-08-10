using System.Globalization;

//Include Google api 
using Google.Apis.Auth.OAuth2;
using Google.Apis.Drive.v3;
using Google.Apis.Services;
using Google.Apis.Drive.v3.Data;

namespace HHBW
{
    public class Utils
    {
        public static async Task<string> GetImageFromDrive(string fileId)
        {
            // Load your credentials (client_secret.json) from a file
            UserCredential credential;
            using (var stream = new FileStream("credentials.json", FileMode.Open, FileAccess.Read))
            {
                credential = await GoogleWebAuthorizationBroker.AuthorizeAsync(
                    GoogleClientSecrets.Load(stream).Secrets,
                    new[] { DriveService.Scope.DriveReadonly },
                    "user",
                    CancellationToken.None
                );
            }

            // Create Drive API service
            var service = new DriveService(new BaseClientService.Initializer()
            {
                HttpClientInitializer = credential,
                ApplicationName = "Google Drive API Sample",
            });

            // Define request parameters
            var request = service.Files.List();
            request.PageSize = 10;
            request.Fields = "nextPageToken, files(id, name)";


            // List files
            var result = await request.ExecuteAsync();
            foreach (var file in result.Files)
            {
                Console.WriteLine($"File Name: {file.Name}, File ID: {file.Id}");
            }

            return string.Empty;
        }
    }
    public static  class DateTimeExtensions
    {

        public enum Months : int
        {
            Jan = 1,
            Feb,
            Mar,
            Apr,
            May,
            Jun,
            Jul,
            Aug,
            Sep,
            Oct,
            Nov,
            Dec,
        }
        public enum AMPM { AM, PM }
        // Extension method to format DateTime in a custom way
        public static DateTime ToCustomFormat(this DateTime dateTime, Months month = default, int day = default, int year = default, int hour = default, int minutes = default, AMPM aMPM = default)
        {

            if (month == default) month = (Months)DateTime.Now.Month;
            if(day == default) day = DateTime.Now.Day;
            if(year == default) year = DateTime.Now.Year;

            if(hour == default) hour = DateTime.Now.Hour;
            if(minutes == default) minutes = DateTime.Now.Minute;
            if (aMPM == default) aMPM = Enum.Parse<AMPM>(DateTime.Now.ToString("tt"));

            string format = "M/d/yyyy h:mmtt"; // Specify the format that matches the input string
            CultureInfo provider = CultureInfo.InvariantCulture;
            return DateTime.ParseExact($"{(int)month}/{day}/{year} {hour}:{minutes.ToString("D2")}{aMPM.ToString().ToLower()}", format, provider);
        }
    }
}
