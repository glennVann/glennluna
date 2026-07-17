using System.ComponentModel.DataAnnotations;

namespace GlennLuna.Api.Models;

public sealed class UserNotification
{
    public int Id { get; set; }

    [MaxLength(450)]
    public string UserId { get; set; } = string.Empty;

    public ApplicationUser? User { get; set; }

    [MaxLength(80)]
    public string Type { get; set; } = "General";

    [MaxLength(160)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(800)]
    public string Message { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Href { get; set; }

    public bool IsRead { get; set; }

    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
    public DateTime? ReadAtUtc { get; set; }
}
