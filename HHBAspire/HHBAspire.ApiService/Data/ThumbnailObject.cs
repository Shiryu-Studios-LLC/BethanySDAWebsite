using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HHBAspire.ApiService.Data;

public class ThumbnailObject
{
    [Key]
    public int Id { get; set; }
    public string? PlaceHolderImage { get; set; }
    public string? SDALogo { get; set; }
}