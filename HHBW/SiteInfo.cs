namespace HHBW
{
    public class SiteInfo
    {
        public static string SDALogo { get; set; } = "https://i.pinimg.com/originals/dd/97/48/dd9748b2cfc8271d76b1c661e05269d3.png";
        public static string Title { get; set; } = "Houston Haitian Bethany";
        public static string Orginization { get; set; } = "Seventh Day Advantis Church";
        public static string Phone { get; set; } = "+1 ";
        public static string Email { get; set; } = "bethanysda777@gmail.com";
        public static string Address { get; set; } = "12112 Carlsbad St, Houston, TX 77085";
        public static string GoogleMap { get; set; } = "https://www.google.com/maps/embed/v1/place?key=AIzaSyC0XiUPly6Q2nFRmdqdSCmbn-" +
            "t7WT1F674&q=Houston+Haitian+Bethany+Church+12112+Carlsbad+St+Houston%2C+TX+77085-1206&attribution_source=" +
            "Houston+Haitian+Bethany+Church&attribution_web_url=http://houstonhaitianbethanytx.adventistchurch.org&zoom=15";
        public static string AboutUs { get; set; } = "The Seventh-day Adventist Church is a mainstream Protestant church with approximately 19 million members worldwide, including more than one million members in North America. The Adventist Church operates 173 hospitals and sanitariums and more than 7,500 schools around the world. The Adventist Development and Relief Agency (ADRA) works within communities in more than 130 countries to provide community development and disaster relief.";
        public static List<Slide> Slides { get; set; } = new ()
        {
            new Slide
            {
                BackgroundImage = PlaceHolderImage,
                Description = "Ut velit est quam dolor ad a aliquid qui aliquid. Sequi ea ut et est quaerat sequi nihil ut aliquam. Occaecati alias dolorem mollitia ut. Similique ea voluptatem. Esse doloremque accusamus repellendus deleniti vel. Minus et tempore modi architecto."
            },
            new Slide
            {
                BackgroundImage = PlaceHolderImage,
                Description = "Ut velit est quam dolor ad a aliquid qui aliquid. Sequi ea ut et est quaerat sequi nihil ut aliquam. Occaecati alias dolorem mollitia ut. Similique ea voluptatem. Esse doloremque accusamus repellendus deleniti vel. Minus et tempore modi architecto."
            },
            new Slide
            {
                BackgroundImage = PlaceHolderImage,
                Description = "Ut velit est quam dolor ad a aliquid qui aliquid. Sequi ea ut et est quaerat sequi nihil ut aliquam. Occaecati alias dolorem mollitia ut. Similique ea voluptatem. Esse doloremque accusamus repellendus deleniti vel. Minus et tempore modi architecto."
            }
        };
        public static List<Service> Services { get; set; } = new ()
        {
            new Service
            {
                Icon = "https://static.vecteezy.com/system/resources/previews/020/966/244/original/hand-holding-a-hearth-shape-icon-symbol-healthcare-volunteering-charity-and-donation-concept-png.png",
                Name = "Online Giving",
                Description = "Want to contribute to our mission."
            }
        };
        public static List<string> Achivements { get; set; } = new() 
        {
            
        };
        public static List<TeamMember> TeamMembers { get; set; } = new()
        {
           
        };


        public static string PlaceHolderImage => "https://images.hdqwalls.com/wallpapers/anime-fantasy-sky-5k-3h.jpg";
    }
}
