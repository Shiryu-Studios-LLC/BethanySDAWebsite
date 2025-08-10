using System.ComponentModel.DataAnnotations;

namespace HHBAspire.Shared.Data;

public class ThumbnailObject
{
    [Key]
    public int Id { get; set; }
    public string? PlaceHolderImage { get; set; }
    public string? SDALogo { get; set; }
}