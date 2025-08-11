using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HHBAspire.Shared.Data;

[Owned] // make this an owned value object
public class BasicInfoObject
{
    public string? Title { get; set; }
    [Column("Organization")]
    public string? Organization { get; set; }
    public string? Phone { get; set; }
    public string? Email { get; set; }
    public string? Address { get; set; }
    public string? AboutUsSDA { get; set; }
    public string? AboutUsBethany { get; set; }
}