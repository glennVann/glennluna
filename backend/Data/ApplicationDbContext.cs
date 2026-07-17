using GlennLuna.Api.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace GlennLuna.Api.Data;

public sealed class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
    : IdentityDbContext<ApplicationUser>(options)
{
    public DbSet<TeamMember> TeamMembers => Set<TeamMember>();
    public DbSet<ContentTask> ContentTasks => Set<ContentTask>();
    public DbSet<QuoteRequest> QuoteRequests => Set<QuoteRequest>();
    public DbSet<KidDesignSubmission> KidDesignSubmissions => Set<KidDesignSubmission>();
    public DbSet<KidDesignOffer> KidDesignOffers => Set<KidDesignOffer>();
    public DbSet<UserNotification> UserNotifications => Set<UserNotification>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<ContentTask>()
            .Property(task => task.SubmissionFile).HasColumnType("longblob");

        builder.Entity<ContentTask>()
            .HasOne(task => task.AssignedToUser)
            .WithMany()
            .HasForeignKey(task => task.AssignedToUserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<QuoteRequest>()
            .HasOne(quote => quote.OwnerUser)
            .WithMany()
            .HasForeignKey(quote => quote.OwnerUserId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.Entity<QuoteRequest>()
            .HasIndex(quote => quote.Status);

        builder.Entity<QuoteRequest>()
            .HasIndex(quote => quote.OwnerUserId);

        builder.Entity<KidDesignSubmission>()
            .HasOne(submission => submission.OwnerUser)
            .WithMany()
            .HasForeignKey(submission => submission.OwnerUserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<KidDesignSubmission>()
            .HasOne(submission => submission.ReviewerUser)
            .WithMany()
            .HasForeignKey(submission => submission.ReviewerUserId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.Entity<KidDesignSubmission>()
            .HasIndex(submission => submission.Status);

        builder.Entity<KidDesignOffer>()
            .HasOne(offer => offer.KidDesignSubmission)
            .WithMany(submission => submission.Offers)
            .HasForeignKey(offer => offer.KidDesignSubmissionId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<KidDesignOffer>()
            .HasOne(offer => offer.ReviewerUser)
            .WithMany()
            .HasForeignKey(offer => offer.ReviewerUserId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.Entity<KidDesignOffer>()
            .HasIndex(offer => offer.Status);

        builder.Entity<UserNotification>()
            .HasOne(notification => notification.User)
            .WithMany()
            .HasForeignKey(notification => notification.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<UserNotification>()
            .HasIndex(notification => new { notification.UserId, notification.IsRead, notification.CreatedAtUtc });

        builder.Entity<TeamMember>()
            .HasOne(member => member.ApplicationUser)
            .WithOne()
            .HasForeignKey<TeamMember>(member => member.ApplicationUserId)
            .OnDelete(DeleteBehavior.SetNull);

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
