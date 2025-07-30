namespace HHBW
{
    [Serializable]
    public class SiteInfo
    {
        public Languages Language;
        public BasicInfoObject Info = new BasicInfoObject();
        public ThumbnailObject Thumbnail = new ThumbnailObject();
        public ApiLinkObject Api = new ApiLinkObject();     
        public List<SlideObject> Slides = new List<SlideObject>();
        public List<ServiceObject> Services = new List<ServiceObject>();
        public List<TeamMemberObject> TeamMembers = new List<TeamMemberObject>();
        public List<NewsObject> News = new List<NewsObject>();
        public MinistryObject Ministries = new MinistryObject();
    }
}
