using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HHBAspire.ApiService.Data;

public class NewsObject
{
    [Key]
    public int Id { get; set; }
    public int SiteInfoId { get; set; }
    public string? ImageUrl { get; set; }
    public string? Headline { get; set; }
    public string? Description { get; set; }
    public DateTime DateTime { get; set; }
    public DateTime DateTimeOffset { get; set; }
}