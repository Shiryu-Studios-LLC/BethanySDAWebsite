using System.ComponentModel.DataAnnotations;

namespace HHBAspire.Shared.Data;

public class TeamMemberObject
{
    [Key]
    public int Id { get; set; }
    public int SiteInfoId { get; set; }
    public string? Image { get; set; }
    public string? Name { get; set; }
    public string? Role { get; set; }
    public string? X { get; set; }
    public string? Facebook { get; set; }
    public string? Instagram { get; set; }
    public string? Linkedin { get; set; }
    public string? Youtube { get; set; }
}