using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HHBAspire.ApiService.Data;

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