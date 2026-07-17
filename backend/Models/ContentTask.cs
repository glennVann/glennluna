using System.ComponentModel.DataAnnotations;

namespace GlennLuna.Api.Models;

public sealed class ContentTask
{
    public int Id { get; set; }
    [MaxLength(160)] public string Title { get; set; } = string.Empty;
    [MaxLength(2000)] public string Instructions { get; set; } = string.Empty;
    [MaxLength(30)] public string Status { get; set; } = "Assigned";
    public DateTime? DueAtUtc { get; set; }
    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
    [MaxLength(10000)] public string SubmissionText { get; set; } = string.Empty;
    [MaxLength(2000)] public string SubmissionNotes { get; set; } = string.Empty;
    [MaxLength(500)] public string SubmissionLink { get; set; } = string.Empty;
    [MaxLength(255)] public string? SubmissionFileName { get; set; }
    [MaxLength(100)] public string? SubmissionFileContentType { get; set; }
    public byte[]? SubmissionFile { get; set; }
    [MaxLength(500)] public string? SubmissionFileObjectKey { get; set; }
    public DateTime? SubmittedAtUtc { get; set; }
    [MaxLength(450)] public string AssignedToUserId { get; set; } = string.Empty;
    public ApplicationUser? AssignedToUser { get; set; }
}
