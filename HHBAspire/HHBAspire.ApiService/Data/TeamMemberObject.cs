using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HHBAspire.ApiService.Data;

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