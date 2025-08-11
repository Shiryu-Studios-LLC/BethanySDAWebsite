using System.ComponentModel.DataAnnotations;

namespace HHBAspire.Shared.Data;

public enum ThumbnailType
{
    PlaceHolderImage,
    SDALogo
}

public class ThumbnailObject
{
    [Key]
    public int Id { get; set; }
    public ThumbnailType Type { get; set; }
    public string? Url { get; set; }

    public int SiteInfoId { get; set; }           // required FK
    public SiteInfo SiteInfo { get; set; } = null!;
}