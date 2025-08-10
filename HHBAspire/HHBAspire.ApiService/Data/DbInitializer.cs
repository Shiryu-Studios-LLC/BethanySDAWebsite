using System;

namespace HHBAspire.ApiService.Data;

public static class DbInitializer
{
    public static void Initialize(BethanyDataContext context)
    {
        // Look for existing SiteInfo
        if (context.SiteInfos.Any())
        {
            return; // DB has been seeded
        }

        var siteInfo = new SiteInfo
        {
            Language = Language.English,
            Info = new BasicInfoObject
            {
                Title = "Houston Haitian Bethany",
                Organization = "Seventh Day Adventist Church",
                Phone = "+1(281)772-3617",
                Email = "houstonhaitianbethany@gmail.com",
                Address = "12112 Carlsbad St, Houston, TX 77085",
                AboutUsSDA = "Default SDA description...",
                AboutUsBethany = "Default Bethany description..."
            },
            Thumbnail = new ThumbnailObject
            {
                PlaceHolderImage = "https://example.com/placeholder.jpg",
                SDALogo = "logoId"
            },
            Api = new ApiLinkObject
            {
                GoogleMap = "https://maps.google.com/...",
                YoutubeChannel = null
            },
            Slides = new List<SlideObject>
            {
                new SlideObject
                {
                    Headline = "Welcome",
                    BackgroundImage = "backgroundId",
                    Description = "Sample slide",
                    Expand = "Explore"
                }
            }
        };

        context.SiteInfos.Add(siteInfo);
        context.SaveChanges();
    }
}
