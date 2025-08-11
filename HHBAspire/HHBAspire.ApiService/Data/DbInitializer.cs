using HHBAspire.Shared;
using HHBAspire.Shared.Data;

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
            Thumbnails = new List<ThumbnailObject>
            {
                new() { Type = ThumbnailType.PlaceHolderImage,  Url = "https://example.com/placeholder.jpg" },
                new() { Type = ThumbnailType.SDALogo,           Url = "https://d1yjjnpx0p53s8.cloudfront.net/styles/logo-original-577x577/s3/072013/seventhdayadventistchurch.jpg?itok=0GgLegTh" }
            },
            Api = new ApiLinkObject
            {
                GoogleMap = "https://maps.google.com/...",
                YoutubeChannel = null
            },
            Slides = new List<SlideObject>
            {
                new()
                {
                    Headline = "Welcome",
                    BackgroundImage = "backgroundId",
                    Description = "Sample slide",
                    Expand = "Explore"
                }
            },
            TeamMembers = new()
            {
                new() { Name = "Stephenson Celant", Role = "Pastor", Instagram = "https://www.instagram.com/redeem5/?igsh=azhobHh4NzRsMWVr#", Youtube = "www.youtube.com/@pr.stephensoncelant" },
                new() { Name = "Jean Bellot Louis", Role = "1st Elder" }
            },
            News = new()
            {
                new() 
                {
                    Headline = "Friday Night Vesper",
                    Description = "Join us for our Friday Night Vesper service at 7:00 PM. A time of worship, prayer, and fellowship.",
                    DateTime = DateTime.Parse("2024-08-02T19:19:00"),
                    DateTimeOffset = DateTime.Parse("0001-01-01T00:00:00")
                }
            },
            Ministries = new()
            {
                new()
                {
                    Title = "Holistic Ministries",
                    Description = "Our Holistic Ministries embrace every member of our church family, nurturing your spirit, heart, and mind with love and care.",
                    Children = new()
                    {
                        new() { Title = "Men’s Ministry", Image = "1JVxgqk_U3rELJRE-lv_24kdgBanv9dOj",  Description = "A strong brotherhood where men grow in faith, support each other, and serve with courage through prayer, Bible study, and fellowship." },
                        new() { Title = "Women’s Ministry", Image = "1JVxgqk_U3rELJRE-lv_24kdgBanv9dOj",  Description = "A warm, uplifting space for women to connect, pray, and empower one another through retreats, workshops, and shared faith." },
                        new() { Title = "Family Ministry",  Image = "1JVxgqk_U3rELJRE-lv_24kdgBanv9dOj",  Description = "A strong brotherhood where men grow in faith, support each other, and serve with courage through prayer, Bible study, and fellowship." },
                        new() { Title = "Youth Ministry (Ages 13-17)",  Image = "1JVxgqk_U3rELJRE-lv_24kdgBanv9dOj",  Description = "Igniting teens’ passion for God with dynamic worship, service projects, and fun activities that build lifelong faith and leadership." },
                        new() { Title = "Young Adult Ministry (Ages 18-40)",  Image = "1JVxgqk_U3rELJRE-lv_24kdgBanv9dOj",  Description = "A welcoming community for young adults to navigate life’s journey, grow in faith, and serve through fellowship and mentorship." },
                    }
                }
            }
        };

        context.SiteInfos.Add(siteInfo);
        context.SaveChanges();
    }
}
