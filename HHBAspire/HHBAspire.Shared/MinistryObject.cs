using System.ComponentModel.DataAnnotations;

namespace HHBAspire.Shared.Data;
public class MinistryObject
{
    [Key]
    public int Id { get; set; }
    public int SiteInfoId { get; set; }
    public string? Title { get; set; }
    public string? Image { get; set; }
    public string? Description { get; set; }
}