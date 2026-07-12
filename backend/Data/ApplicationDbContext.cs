using GlennLuna.Api.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace GlennLuna.Api.Data;

public sealed class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
    : IdentityDbContext<ApplicationUser>(options)
{
    public DbSet<TeamMember> TeamMembers => Set<TeamMember>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<TeamMember>().HasData(
            new TeamMember
            {
                Id = 1,
                Name = "Graphic Artist",
                Role = "Graphic Artist",
                Focus = "Visual identity and creative direction",
                Description = "Helps with logos, brand assets, campaign graphics, and the visual details that make a project feel consistent.",
                SkillsJson = "[\"Brand Design\",\"Digital Graphics\",\"Creative Assets\"]",
                SortOrder = 1,
                IsActive = true
            },
            new TeamMember
            {
                Id = 2,
                Name = "Content Writer",
                Role = "Content Writer",
                Focus = "Clear messaging and useful content",
                Description = "Works on website copy, product messaging, and search-friendly content that is clear and easy to read.",
                SkillsJson = "[\"Web Copy\",\"Content Strategy\",\"SEO Writing\"]",
                SortOrder = 2,
                IsActive = true
            });
    }
}
