using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HHBAspire.ApiService.Data;

public class ServiceObject
{
    [Key]
    public int Id { get; set; }
    public int SiteInfoId { get; set; }
    public string ServiceId { get; set; } = string.Empty;
    public string Name { get; set; } = "New-ServiceObject";
    public string Icon { get; set; } = "img/slide/slide-3.jpg";
    public string Description { get; set; } = "New-ServiceObject";
    public string Link { get; set; } = string.Empty;
}