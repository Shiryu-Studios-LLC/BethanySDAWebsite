using System.ComponentModel.DataAnnotations;

namespace HHBAspire.Shared.Data;

public class SlideObject
{
    [Key]
    public int Id { get; set; }
    public int SiteInfoId { get; set; }
    public string? Headline { get; set; }
    public string? BackgroundImage { get; set; }
    public string? Description { get; set; }
    public string? Expand { get; set; }
}