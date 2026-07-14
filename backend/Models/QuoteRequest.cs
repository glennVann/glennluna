using System.ComponentModel.DataAnnotations;

namespace GlennLuna.Api.Models;

public sealed class QuoteRequest
{
    public int Id { get; set; }

    [MaxLength(450)]
    public string? OwnerUserId { get; set; }

    public ApplicationUser? OwnerUser { get; set; }

    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(256)]
    public string Email { get; set; } = string.Empty;

    [MaxLength(160)]
    public string Company { get; set; } = string.Empty;

    [MaxLength(80)]
    public string ProjectType { get; set; } = string.Empty;

    [MaxLength(1000)]
    public string ServicesJson { get; set; } = "[]";

    [MaxLength(120)]
    public string Timeline { get; set; } = string.Empty;

    [MaxLength(120)]
    public string Budget { get; set; } = string.Empty;

    [MaxLength(8000)]
    public string Details { get; set; } = string.Empty;

    [MaxLength(3000)]
    public string InfrastructureNotes { get; set; } = string.Empty;

    [MaxLength(30)]
    public string Status { get; set; } = "New";

    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAtUtc { get; set; } = DateTime.UtcNow;
}
