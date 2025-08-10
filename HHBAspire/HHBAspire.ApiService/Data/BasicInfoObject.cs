using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HHBAspire.ApiService.Data;
public class BasicInfoObject
{
    [Key]
    public int Id { get; set; }
    public string? Title { get; set; }

    [Column("Organization")]
    public string? Organization { get; set; }

    public string? Phone { get; set; }
    public string? Email { get; set; }
    public string? Address { get; set; }
    public string? AboutUsSDA { get; set; }
    public string? AboutUsBethany { get; set; }
}