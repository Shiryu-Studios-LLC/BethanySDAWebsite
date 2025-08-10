using System.ComponentModel.DataAnnotations;

namespace HHBAspire.Shared.Data;

public class ApiLinkObject
{
    [Key]
    public int Id { get; set; }
    public string? YoutubeChannel { get; set; }
    public string? GoogleMap { get; set; }
}