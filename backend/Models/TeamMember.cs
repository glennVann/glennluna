using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GlennLuna.Api.Models;

public sealed class TeamMember
{
    public int Id { get; set; }

    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(100)]
    public string Role { get; set; } = string.Empty;

    [MaxLength(160)]
    public string Focus { get; set; } = string.Empty;

    [MaxLength(1000)]
    public string Description { get; set; } = string.Empty;

    [Column(TypeName = "text")]
    public string SkillsJson { get; set; } = "[]";

    [Column(TypeName = "longblob")]
    public byte[]? Photo { get; set; }

    [MaxLength(50)]
    public string? PhotoContentType { get; set; }

    public int SortOrder { get; set; }

    public bool IsActive { get; set; } = true;
}
