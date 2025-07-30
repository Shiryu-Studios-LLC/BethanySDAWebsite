namespace HHBW
{
    [Serializable]
    public class MinistryObject
    {
        public string? Title = "MinistryObject";
        public string? Image;
        public string? Description;
        public List<MinistryObject> Ministries = new List<MinistryObject>();
    }
}