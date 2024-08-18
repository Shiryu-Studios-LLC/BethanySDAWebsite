namespace HHBW
{
    [Serializable]
    public class SiteInfo
    {
        public string PlaceHolderImage;
        public Language Language;
        public string SDALogo;
        public string Title;
        public string Orginization;
        public string Phone;
        public string Email;
        public string Address;
        public string YoutubeChannelID;
        public string GoogleMap;
        public string AboutUsSDA;
        public string AboutUsBethany;
        public List<Slide> Slides = new List<Slide>();
        public List<Service> Services = new List<Service>();
        public List<TeamMember> TeamMembers = new List<TeamMember>();
        public List<News> News = new List<News>();
    }
}
