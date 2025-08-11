using System.ComponentModel.DataAnnotations;

namespace HHBAspire.Shared.Data;

public class MinistryObject
{
    public int Id { get; set; }

    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Image { get; set; }

    public int SiteInfoId { get; set; }
    public SiteInfo SiteInfo { get; set; } = null!;

    public int? ParentId { get; set; }            // optional self-FK
    public MinistryObject? Parent { get; set; }
    public List<MinistryObject> Children { get; set; } = new();
}
