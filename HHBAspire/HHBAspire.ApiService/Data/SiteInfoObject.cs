using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HHBAspire.ApiService.Data;

public class SiteInfo
{
    [Key]
    public int Id { get; set; }
    public Language Language { get; set; }

    public BasicInfoObject Info { get; set; }
    public ThumbnailObject Thumbnail { get; set; } 
    public ApiLinkObject Api { get; set; }

    public List<SlideObject> Slides { get; set; } = new();
    public List<ServiceObject> Services { get; set; } = new();
    public List<TeamMemberObject> TeamMembers { get; set; } = new();
    public List<NewsObject> News { get; set; } = new();
    public List<MinistryObject> Ministries { get; set; } = new();
}