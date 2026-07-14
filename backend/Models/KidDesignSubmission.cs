using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GlennLuna.Api.Models;

public sealed class KidDesignSubmission
{
    public int Id { get; set; }

    [MaxLength(120)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(2000)]
    public string Description { get; set; } = string.Empty;

    [MaxLength(500)]
    public string DesignLink { get; set; } = string.Empty;

    [MaxLength(30)]
    public string Status { get; set; } = "Draft";

    public bool IsForSale { get; set; }

    [Column(TypeName = "decimal(10,2)")]
    public decimal? AskingPrice { get; set; }

    [MaxLength(3)]
    public string SaleCurrency { get; set; } = "CAD";

    [MaxLength(255)]
    public string? DesignFileName { get; set; }

    [MaxLength(100)]
    public string? DesignFileContentType { get; set; }

    [Column(TypeName = "longblob")]
    public byte[]? DesignFile { get; set; }

    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAtUtc { get; set; } = DateTime.UtcNow;
    public DateTime? SubmittedAtUtc { get; set; }
    public DateTime? ReviewedAtUtc { get; set; }
    public DateTime? PublishedAtUtc { get; set; }

    [MaxLength(450)]
    public string OwnerUserId { get; set; } = string.Empty;

    public ApplicationUser? OwnerUser { get; set; }

    [MaxLength(450)]
    public string? ReviewerUserId { get; set; }

    public ApplicationUser? ReviewerUser { get; set; }

    public ICollection<KidDesignOffer> Offers { get; set; } = [];
}
