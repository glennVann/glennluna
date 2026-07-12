using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GlennLuna.Api.Models;

public sealed class ApplicationUser : IdentityUser
{
    [MaxLength(40)]
    public string Role { get; set; } = "User";

    [MaxLength(100)]
    public string? DisplayName { get; set; }

    [Column(TypeName = "longblob")]
    public byte[]? ProfileImage { get; set; }

    [MaxLength(50)]
    public string? ProfileImageContentType { get; set; }
}
