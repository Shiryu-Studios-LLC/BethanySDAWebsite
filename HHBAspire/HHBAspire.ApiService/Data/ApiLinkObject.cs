using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HHBAspire.ApiService.Data;

public class ApiLinkObject
{
    [Key]
    public int Id { get; set; }
    public string? YoutubeChannel { get; set; }
    public string? GoogleMap { get; set; }
}