using System.Security.Cryptography.X509Certificates;

namespace HHBW
{
    public class SiteManager
    {
        private static bool _SiteInfoWasModified { get; set; }
        public Utils GetUtils { get; private set; }
        public SiteInfo GetInfo { get; private set; }


        public SiteManager(Utils utils)
        {
            GetUtils = utils;
        }

        /// <summary>
        /// Load Siteinfo from file     
        /// </summary>
        /// <returns>SiteInfo object if the file exist</returns>
        public async Task GetSiteInfoAsync()
        {
            var _SiteInfo = await GetUtils.LoadSiteInfoAsync();
            if (_SiteInfo != null)
                GetInfo = _SiteInfo;
        }

        public static SiteInfo? GetDefaultSiteInfo()
        {
           return new SiteInfo
            {
                Info = new BasicInfo
                {
                    Title = "Default Site Title",
                    Orginization = "Default Site Orginization",
                    Phone = "+1(123)456-7890",
                    Email = "example@example.com",
                    Address = "1234 Example Ln, Example, EX, 12345",
                    AboutUsSDA = "Default About Us SDA",
                    AboutUsBethany = "Default About Us Bethany"
                },
                Thumbnail = new Thumbnail
                {
                    SDALogo = "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Example_en.svg/1024px-Example_en.svg.png",
                    PlaceHolderImage = "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Example_en.svg/1024px-Example_en.svg.png",
                },
                Api = new LinkedApis(),
                Language = Languages.EN,
                Slides = new List<Slide>(),
                Services = new List<Service>(),
                TeamMembers = new List<TeamMember>(),
                News = new List<News>()
           };
        }
    }
}