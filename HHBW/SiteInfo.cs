namespace HHBW
{
    [Serializable]
    public class SiteInfo
    {
        public BasicInfo Info = new BasicInfo();
        public Thumbnail Thumbnail = new Thumbnail();
        public LinkedApis Api = new LinkedApis();     
        public Languages Language;
        public List<Slide> Slides = new List<Slide>();
        public List<Service> Services = new List<Service>();
        public List<TeamMember> TeamMembers = new List<TeamMember>();
        public List<News> News = new List<News>();
    }
}
