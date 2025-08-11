using System.ComponentModel.DataAnnotations;

namespace HHBAspire.Shared.Data;

public class ServiceObject
{
    [Key]
    public int Id { get; set; }
    public string ServiceId { get; set; } = string.Empty;
    public string Name { get; set; } = "New-ServiceObject";
    public string Icon { get; set; } = "img/slide/slide-3.jpg";
    public string Description { get; set; } = "New-ServiceObject";
    public string Link { get; set; } = string.Empty;

    public int SiteInfoId { get; set; }           // required FK
    public SiteInfo SiteInfo { get; set; } = null!;
}