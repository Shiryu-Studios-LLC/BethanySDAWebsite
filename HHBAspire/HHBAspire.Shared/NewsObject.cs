using System.ComponentModel.DataAnnotations;

namespace HHBAspire.Shared.Data;

public class NewsObject
{
    [Key]
    public int Id { get; set; }
    public string? ImageUrl { get; set; }
    public string? Headline { get; set; }
    public string? Description { get; set; }
    public DateTime DateTime { get; set; }
    public DateTime DateTimeOffset { get; set; }

    public int SiteInfoId { get; set; }           // required FK
    public SiteInfo SiteInfo { get; set; } = null!;
}