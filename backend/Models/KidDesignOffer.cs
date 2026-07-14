using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GlennLuna.Api.Models;

public sealed class KidDesignOffer
{
    public int Id { get; set; }

    public int KidDesignSubmissionId { get; set; }

    public KidDesignSubmission? KidDesignSubmission { get; set; }

    [MaxLength(100)]
    public string BuyerName { get; set; } = string.Empty;

    [MaxLength(256)]
    public string BuyerEmail { get; set; } = string.Empty;

    [Column(TypeName = "decimal(10,2)")]
    public decimal OfferAmount { get; set; }

    [MaxLength(3)]
    public string Currency { get; set; } = "CAD";

    [MaxLength(1200)]
    public string Message { get; set; } = string.Empty;

    [MaxLength(30)]
    public string Status { get; set; } = "New";

    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
    public DateTime? ReviewedAtUtc { get; set; }

    [MaxLength(450)]
    public string? ReviewerUserId { get; set; }

    public ApplicationUser? ReviewerUser { get; set; }
}
