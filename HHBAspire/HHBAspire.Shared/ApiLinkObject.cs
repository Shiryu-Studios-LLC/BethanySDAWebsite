using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace HHBAspire.Shared.Data;

[Owned] // make this an owned value object
public class ApiLinkObject
{
    public string? YoutubeChannel { get; set; }
    public string? GoogleMap { get; set; }
}