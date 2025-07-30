namespace HHBW
{
    [Serializable]
    public class NewsObject
    {
        public string? Imageurl { get; set; }
        public string? Headline { get; set; }
        public string? Description { get; set; }
        public DateTime DateTime { get; set; }
        public DateTime DateTimeOffset { get; set; }
    }
}