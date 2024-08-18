namespace HHBW
{
    [Serializable]
    public class News
    {
        public string? imageurl { get; set; }
        public string? Headline { get; set; }
        public string? Description { get; set; }
        public DateTime DateTime { get; set; }
        public DateTime DateTimeOffset { get; set; }
    }
}