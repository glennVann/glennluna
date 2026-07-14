using GlennLuna.Api.Data;
using GlennLuna.Api.Configuration;
using GlennLuna.Api.Models;
using GlennLuna.Api.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Net.Mail;
using System.Security.Claims;
using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);

DotEnvConfiguration.AddMissingValues(builder.Configuration, builder.Environment.ContentRootPath);

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? throw new InvalidOperationException(
        "Connection string 'DefaultConnection' was not configured. " +
        "Set ConnectionStrings__DefaultConnection or use dotnet user-secrets.");
var adminEmail = builder.Configuration["ADMIN_EMAIL"]
    ?? builder.Configuration["AdminEmail"]
    ?? "glenncotamuraluna@gmail.com";

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

builder.Services
    .AddIdentityApiEndpoints<ApplicationUser>(options =>
    {
        options.User.RequireUniqueEmail = true;
        options.SignIn.RequireConfirmedEmail = true;
        options.Password.RequiredLength = 8;
        options.Password.RequireDigit = true;
        options.Password.RequireLowercase = true;
        options.Password.RequireUppercase = false;
        options.Password.RequireNonAlphanumeric = false;
    })
    .AddEntityFrameworkStores<ApplicationDbContext>();

builder.Services.AddTransient<IEmailSender<ApplicationUser>, SmtpIdentityEmailSender>();
builder.Services.AddTransient<ITaskEmailSender, TaskEmailSender>();

builder.Services.AddAuthorization();
builder.Services.AddCors(options =>
    options.AddPolicy("Frontend", policy =>
        policy.WithOrigins(builder.Configuration["FrontendUrl"] ?? "http://localhost:3003")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials()));

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseCors("Frontend");
app.UseAuthentication();
app.UseAuthorization();

app.MapGroup("/api/auth").MapIdentityApi<ApplicationUser>();

app.MapGet("/api/auth/me", async (ClaimsPrincipal principal, UserManager<ApplicationUser> userManager) =>
    {
        var user = await userManager.GetUserAsync(principal);
        return user is null
            ? Results.Unauthorized()
            : Results.Ok(new
            {
                user.Id,
                user.Email,
                user.UserName,
                user.DisplayName,
                user.Role,
                HasProfileImage = user.ProfileImage is { Length: > 0 },
                IsTeamAdmin = IsTeamAdmin(user, adminEmail)
            });
    })
    .RequireAuthorization();

app.MapGet("/api/auth/avatar", async (ClaimsPrincipal principal, UserManager<ApplicationUser> userManager) =>
    {
        var user = await userManager.GetUserAsync(principal);
        return user?.ProfileImage is not { Length: > 0 } image
            ? Results.NotFound()
            : Results.File(image, user.ProfileImageContentType ?? "application/octet-stream");
    })
    .RequireAuthorization();

app.MapPut("/api/auth/profile", async (
    UpdateProfileRequest request,
    ClaimsPrincipal principal,
    UserManager<ApplicationUser> userManager) =>
    {
        var user = await userManager.GetUserAsync(principal);
        if (user is null)
        {
            return Results.Unauthorized();
        }

        var displayName = request.DisplayName?.Trim();
        if (displayName?.Length > 100)
        {
            return Results.ValidationProblem(new Dictionary<string, string[]>
            {
                ["displayName"] = ["Display name must be 100 characters or fewer."]
            });
        }

        user.DisplayName = string.IsNullOrWhiteSpace(displayName) ? null : displayName;

        if (request.RemoveProfileImage)
        {
            user.ProfileImage = null;
            user.ProfileImageContentType = null;
        }
        else if (!string.IsNullOrWhiteSpace(request.ProfileImageBase64))
        {
            var allowedTypes = new HashSet<string>(StringComparer.OrdinalIgnoreCase)
            {
                "image/jpeg",
                "image/png",
                "image/webp"
            };
            if (request.ProfileImageContentType is null || !allowedTypes.Contains(request.ProfileImageContentType))
            {
                return Results.ValidationProblem(new Dictionary<string, string[]>
                {
                    ["profileImage"] = ["Profile photo must be a JPEG, PNG, or WebP image."]
                });
            }

            byte[] image;
            try
            {
                image = Convert.FromBase64String(request.ProfileImageBase64);
            }
            catch (FormatException)
            {
                return Results.ValidationProblem(new Dictionary<string, string[]>
                {
                    ["profileImage"] = ["The uploaded profile photo is invalid."]
                });
            }

            if (image.Length > 2 * 1024 * 1024)
            {
                return Results.ValidationProblem(new Dictionary<string, string[]>
                {
                    ["profileImage"] = ["Profile photo must be 2 MB or smaller."]
                });
            }

            user.ProfileImage = image;
            user.ProfileImageContentType = request.ProfileImageContentType.ToLowerInvariant();
        }

        var result = await userManager.UpdateAsync(user);
        if (!result.Succeeded)
        {
            return Results.ValidationProblem(result.Errors
                .GroupBy(error => error.Code)
                .ToDictionary(group => group.Key, group => group.Select(error => error.Description).ToArray()));
        }

        return Results.Ok(new
        {
            user.Id,
            user.Email,
            user.UserName,
                user.DisplayName,
                user.Role,
            HasProfileImage = user.ProfileImage is { Length: > 0 },
            IsTeamAdmin = IsTeamAdmin(user, adminEmail)
        });
    })
    .RequireAuthorization();

app.MapGet("/api/work/users", async (ClaimsPrincipal principal, UserManager<ApplicationUser> users) =>
    {
        var current = await users.GetUserAsync(principal);
        if (current is null || !IsTeamAdmin(current, adminEmail)) return Results.Forbid();
        return Results.Ok(await users.Users.OrderBy(user => user.Email).Select(user => new
        {
            user.Id, user.Email, user.DisplayName, user.Role
        }).ToListAsync());
    }).RequireAuthorization();

app.MapPut("/api/work/users/{id}/role", async (string id, RoleRequest request, ClaimsPrincipal principal,
    UserManager<ApplicationUser> users) =>
    {
        var current = await users.GetUserAsync(principal);
        if (current is null || !IsTeamAdmin(current, adminEmail)) return Results.Forbid();
        var user = await users.FindByIdAsync(id);
        if (user is null) return Results.NotFound();
        var role = request.Role?.Trim();
        if (role is null || !IsValidAccountRole(role))
            return Results.ValidationProblem(new Dictionary<string, string[]> { ["role"] = ["Choose User, Content Writer, Worker, KidCreator, or ParentReviewer."] });
        user.Role = role;
        await users.UpdateAsync(user);
        return Results.Ok(new { user.Id, user.Email, user.DisplayName, user.Role });
    }).RequireAuthorization();

app.MapGet("/api/work/tasks", async (ClaimsPrincipal principal, UserManager<ApplicationUser> users,
    ApplicationDbContext db) =>
    {
        var user = await users.GetUserAsync(principal);
        if (user is null) return Results.Unauthorized();
        var admin = IsTeamAdmin(user, adminEmail);
        var query = db.ContentTasks.AsNoTracking().Include(task => task.AssignedToUser).AsQueryable();
        if (!admin) query = query.Where(task => task.AssignedToUserId == user.Id);
        return Results.Ok(await query.OrderBy(task => task.Status == "Completed").ThenBy(task => task.DueAtUtc)
            .Select(task => new { task.Id, task.Title, task.Instructions, task.Status, task.DueAtUtc,
                task.SubmissionText, task.SubmissionNotes, task.SubmissionLink, task.SubmittedAtUtc,
                HasSubmissionFile = task.SubmissionFile != null, task.SubmissionFileName,
                task.AssignedToUserId, Assignee = task.AssignedToUser!.DisplayName ?? task.AssignedToUser.Email })
            .ToListAsync());
    }).RequireAuthorization();

app.MapPut("/api/work/tasks/{id:int}/submission", async (int id, SubmissionRequest request,
    ClaimsPrincipal principal, UserManager<ApplicationUser> users, ApplicationDbContext db) =>
    {
        var user = await users.GetUserAsync(principal);
        if (user is null) return Results.Unauthorized();
        var task = await db.ContentTasks.FindAsync(id);
        if (task is null) return Results.NotFound();
        if (task.AssignedToUserId != user.Id || !CanReceiveWork(user)) return Results.Forbid();
        if ((request.Content?.Length ?? 0) > 10000 || (request.Notes?.Length ?? 0) > 2000)
            return Results.ValidationProblem(new Dictionary<string, string[]> { ["submission"] = ["Content or notes are too long."] });
        var link = request.Link?.Trim() ?? "";
        if (link.Length > 500 || (link.Length > 0 && (!Uri.TryCreate(link, UriKind.Absolute, out var uri) || uri.Scheme is not ("http" or "https"))))
            return Results.ValidationProblem(new Dictionary<string, string[]> { ["link"] = ["Use a valid http or https link."] });

        byte[]? file = null;
        if (!string.IsNullOrWhiteSpace(request.FileBase64))
        {
            try { file = Convert.FromBase64String(request.FileBase64); }
            catch (FormatException) { return Results.ValidationProblem(new Dictionary<string, string[]> { ["file"] = ["The uploaded file is invalid."] }); }
            if (file.Length > 5 * 1024 * 1024)
                return Results.ValidationProblem(new Dictionary<string, string[]> { ["file"] = ["The file must be 5 MB or smaller."] });
            if (!IsAllowedSubmissionFile(file, request.FileContentType, request.FileName))
                return Results.ValidationProblem(new Dictionary<string, string[]> { ["file"] = ["Upload a JPEG, PNG, WebP, PDF, Word (.docx), or text file."] });
            task.SubmissionFile = file;
            task.SubmissionFileName = Path.GetFileName(request.FileName!);
            task.SubmissionFileContentType = request.FileContentType!.ToLowerInvariant();
        }
        if (string.IsNullOrWhiteSpace(request.Content) && string.IsNullOrWhiteSpace(request.Notes) && string.IsNullOrWhiteSpace(link) && task.SubmissionFile is null)
            return Results.ValidationProblem(new Dictionary<string, string[]> { ["submission"] = ["Add written content, notes, a link, or a file."] });
        task.SubmissionText = request.Content?.Trim() ?? ""; task.SubmissionNotes = request.Notes?.Trim() ?? "";
        task.SubmissionLink = link; task.SubmittedAtUtc = DateTime.UtcNow; task.Status = "Submitted";
        await db.SaveChangesAsync(); return Results.NoContent();
    }).RequireAuthorization();

app.MapGet("/api/work/tasks/{id:int}/submission-file", async (int id, ClaimsPrincipal principal,
    UserManager<ApplicationUser> users, ApplicationDbContext db, HttpContext context) =>
    {
        var user = await users.GetUserAsync(principal);
        if (user is null) return Results.Unauthorized();
        var task = await db.ContentTasks.AsNoTracking().SingleOrDefaultAsync(item => item.Id == id);
        if (task is null) return Results.NotFound();
        if (!IsTeamAdmin(user, adminEmail) && task.AssignedToUserId != user.Id) return Results.Forbid();
        if (task.SubmissionFile is null) return Results.NotFound();
        context.Response.Headers.XContentTypeOptions = "nosniff";
        return Results.File(task.SubmissionFile, task.SubmissionFileContentType ?? "application/octet-stream",
            Path.GetFileName(task.SubmissionFileName ?? "submission"), enableRangeProcessing: false);
    }).RequireAuthorization();

app.MapPost("/api/work/tasks", async (TaskRequest request, ClaimsPrincipal principal,
    UserManager<ApplicationUser> users, ApplicationDbContext db, ITaskEmailSender taskEmailSender) =>
    {
        var current = await users.GetUserAsync(principal);
        if (current is null || !IsTeamAdmin(current, adminEmail)) return Results.Forbid();
        var assignee = await users.FindByIdAsync(request.AssignedToUserId ?? "");
        if (assignee is null || !CanReceiveWork(assignee))
            return Results.ValidationProblem(new Dictionary<string, string[]> { ["assignee"] = ["Select a content writer or worker."] });
        if (string.IsNullOrWhiteSpace(request.Title) || request.Title.Trim().Length > 160)
            return Results.ValidationProblem(new Dictionary<string, string[]> { ["title"] = ["A title of 160 characters or fewer is required."] });
        var task = new ContentTask { Title = request.Title.Trim(), Instructions = request.Instructions?.Trim() ?? "",
            DueAtUtc = request.DueAtUtc, AssignedToUserId = assignee.Id };
        await using var transaction = await db.Database.BeginTransactionAsync();
        db.ContentTasks.Add(task); await db.SaveChangesAsync();
        try
        {
            await taskEmailSender.SendAssignmentAsync(assignee, task);
            await transaction.CommitAsync();
        }
        catch (Exception exception) when (exception is SmtpException or InvalidOperationException)
        {
            await transaction.RollbackAsync();
            return Results.Problem("The task was not assigned because the notification email could not be sent. Check the SMTP configuration and try again.", statusCode: 502);
        }
        return Results.Created($"/api/work/tasks/{task.Id}", new { task.Id });
    }).RequireAuthorization();

app.MapPut("/api/work/tasks/{id:int}/status", async (int id, TaskStatusRequest request, ClaimsPrincipal principal,
    UserManager<ApplicationUser> users, ApplicationDbContext db) =>
    {
        var user = await users.GetUserAsync(principal);
        if (user is null) return Results.Unauthorized();
        var task = await db.ContentTasks.FindAsync(id);
        if (task is null) return Results.NotFound();
        if (!IsTeamAdmin(user, adminEmail) && task.AssignedToUserId != user.Id) return Results.Forbid();
        if (request.Status is not ("Assigned" or "In Progress" or "Submitted" or "Completed"))
            return Results.ValidationProblem(new Dictionary<string, string[]> { ["status"] = ["Choose Assigned, In Progress, Submitted, or Completed."] });
        task.Status = request.Status; await db.SaveChangesAsync(); return Results.NoContent();
    }).RequireAuthorization();

app.MapGet("/api/work/designs", async (ClaimsPrincipal principal, UserManager<ApplicationUser> users,
    ApplicationDbContext db) =>
    {
        var user = await users.GetUserAsync(principal);
        if (user is null) return Results.Unauthorized();
        if (!CanUseKidDesigns(user, adminEmail)) return Results.Ok(Array.Empty<KidDesignSubmissionResponse>());

        var reviewer = CanReviewKidDesigns(user, adminEmail);
        var query = db.KidDesignSubmissions.AsNoTracking()
            .Include(submission => submission.OwnerUser)
            .Include(submission => submission.ReviewerUser)
            .AsQueryable();
        if (!reviewer) query = query.Where(submission => submission.OwnerUserId == user.Id);

        var submissions = await query
            .OrderBy(submission => submission.Status == "Published")
            .ThenByDescending(submission => submission.UpdatedAtUtc)
            .ToListAsync();

        return Results.Ok(submissions.Select(ToKidDesignSubmissionResponse));
    }).RequireAuthorization();

app.MapPost("/api/work/designs", async (KidDesignSubmissionRequest request,
    ClaimsPrincipal principal, UserManager<ApplicationUser> users, ApplicationDbContext db) =>
    {
        var user = await users.GetUserAsync(principal);
        if (user is null) return Results.Unauthorized();
        if (user.Role != "KidCreator") return Results.Forbid();

        var errors = ValidateKidDesignSubmission(request, requireContent: request.Submit);
        if (errors.Count > 0) return Results.ValidationProblem(errors);

        var submission = new KidDesignSubmission { OwnerUserId = user.Id };
        ApplyKidDesignSubmission(submission, request);
        if (!TryApplyDesignFile(submission, request, out var fileError))
            return Results.ValidationProblem(new Dictionary<string, string[]> { ["file"] = [fileError] });

        if (request.Submit)
        {
            submission.Status = "Submitted";
            submission.SubmittedAtUtc = DateTime.UtcNow;
        }

        db.KidDesignSubmissions.Add(submission);
        await db.SaveChangesAsync();
        return Results.Created($"/api/work/designs/{submission.Id}", ToKidDesignSubmissionResponse(submission));
    }).RequireAuthorization();

app.MapPut("/api/work/designs/{id:int}", async (int id, KidDesignSubmissionRequest request,
    ClaimsPrincipal principal, UserManager<ApplicationUser> users, ApplicationDbContext db) =>
    {
        var user = await users.GetUserAsync(principal);
        if (user is null) return Results.Unauthorized();
        if (user.Role != "KidCreator") return Results.Forbid();

        var submission = await db.KidDesignSubmissions
            .Include(item => item.OwnerUser)
            .SingleOrDefaultAsync(item => item.Id == id);
        if (submission is null) return Results.NotFound();
        if (submission.OwnerUserId != user.Id) return Results.Forbid();
        if (submission.Status is "Approved" or "Published")
            return Results.ValidationProblem(new Dictionary<string, string[]> { ["status"] = ["Approved or published designs cannot be edited by the creator."] });

        var errors = ValidateKidDesignSubmission(
            request,
            requireContent: request.Submit,
            hasExistingFile: submission.DesignFile is { Length: > 0 });
        if (errors.Count > 0) return Results.ValidationProblem(errors);

        ApplyKidDesignSubmission(submission, request);
        if (!TryApplyDesignFile(submission, request, out var fileError))
            return Results.ValidationProblem(new Dictionary<string, string[]> { ["file"] = [fileError] });

        if (request.Submit)
        {
            submission.Status = "Submitted";
            submission.SubmittedAtUtc ??= DateTime.UtcNow;
        }

        await db.SaveChangesAsync();
        return Results.Ok(ToKidDesignSubmissionResponse(submission));
    }).RequireAuthorization();

app.MapPut("/api/work/designs/{id:int}/status", async (int id, KidDesignStatusRequest request,
    ClaimsPrincipal principal, UserManager<ApplicationUser> users, ApplicationDbContext db) =>
    {
        var user = await users.GetUserAsync(principal);
        if (user is null) return Results.Unauthorized();
        if (!CanReviewKidDesigns(user, adminEmail)) return Results.Forbid();

        var submission = await db.KidDesignSubmissions
            .Include(item => item.OwnerUser)
            .Include(item => item.ReviewerUser)
            .SingleOrDefaultAsync(item => item.Id == id);
        if (submission is null) return Results.NotFound();

        var status = request.Status?.Trim();
        if (!IsValidKidDesignStatus(status))
            return Results.ValidationProblem(new Dictionary<string, string[]> { ["status"] = ["Choose Draft, Submitted, Approved, or Published."] });
        var saleErrors = ValidateKidDesignSaleSettings(request.IsForSale, request.AskingPrice, request.SaleCurrency, status);
        if (saleErrors.Count > 0) return Results.ValidationProblem(saleErrors);

        submission.Status = status!;
        submission.UpdatedAtUtc = DateTime.UtcNow;
        submission.ReviewerUserId = user.Id;
        submission.ReviewedAtUtc = DateTime.UtcNow;
        if (status == "Submitted") submission.SubmittedAtUtc ??= DateTime.UtcNow;
        if (status == "Published") submission.PublishedAtUtc ??= DateTime.UtcNow;
        if (status != "Published") submission.PublishedAtUtc = null;
        ApplyKidDesignSaleSettings(submission, request.IsForSale, request.AskingPrice, request.SaleCurrency);

        await db.SaveChangesAsync();
        return Results.Ok(ToKidDesignSubmissionResponse(submission));
    }).RequireAuthorization();

app.MapGet("/api/work/designs/{id:int}/file", async (int id, ClaimsPrincipal principal,
    UserManager<ApplicationUser> users, ApplicationDbContext db, HttpContext context) =>
    {
        var user = await users.GetUserAsync(principal);
        if (user is null) return Results.Unauthorized();

        var submission = await db.KidDesignSubmissions.AsNoTracking().SingleOrDefaultAsync(item => item.Id == id);
        if (submission is null) return Results.NotFound();
        if (!CanReviewKidDesigns(user, adminEmail) && submission.OwnerUserId != user.Id) return Results.Forbid();
        if (submission.DesignFile is null) return Results.NotFound();

        context.Response.Headers.XContentTypeOptions = "nosniff";
        return Results.File(submission.DesignFile, submission.DesignFileContentType ?? "application/octet-stream",
            Path.GetFileName(submission.DesignFileName ?? "design-submission"), enableRangeProcessing: false);
    }).RequireAuthorization();

app.MapGet("/api/work/design-offers", async (ClaimsPrincipal principal, UserManager<ApplicationUser> users,
    ApplicationDbContext db) =>
    {
        var user = await users.GetUserAsync(principal);
        if (user is null) return Results.Unauthorized();
        if (!CanReviewKidDesigns(user, adminEmail)) return Results.Forbid();

        var offers = await db.KidDesignOffers.AsNoTracking()
            .Include(offer => offer.KidDesignSubmission)
                .ThenInclude(submission => submission!.OwnerUser)
            .Include(offer => offer.ReviewerUser)
            .OrderBy(offer => offer.Status == "Accepted" || offer.Status == "Declined")
            .ThenByDescending(offer => offer.CreatedAtUtc)
            .ToListAsync();

        return Results.Ok(offers.Select(ToKidDesignOfferResponse));
    }).RequireAuthorization();

app.MapPut("/api/work/design-offers/{id:int}/status", async (int id, KidDesignOfferStatusRequest request,
    ClaimsPrincipal principal, UserManager<ApplicationUser> users, ApplicationDbContext db) =>
    {
        var user = await users.GetUserAsync(principal);
        if (user is null) return Results.Unauthorized();
        if (!CanReviewKidDesigns(user, adminEmail)) return Results.Forbid();

        var offer = await db.KidDesignOffers
            .Include(item => item.KidDesignSubmission)
                .ThenInclude(submission => submission!.OwnerUser)
            .Include(item => item.ReviewerUser)
            .SingleOrDefaultAsync(item => item.Id == id);
        if (offer is null) return Results.NotFound();

        var status = request.Status?.Trim();
        if (!IsValidKidDesignOfferStatus(status))
            return Results.ValidationProblem(new Dictionary<string, string[]> { ["status"] = ["Choose New, Reviewing, Accepted, or Declined."] });

        offer.Status = status!;
        offer.ReviewerUserId = user.Id;
        offer.ReviewedAtUtc = DateTime.UtcNow;
        await db.SaveChangesAsync();

        return Results.Ok(ToKidDesignOfferResponse(offer));
    }).RequireAuthorization();

app.MapGet("/api/kids-corner/designs", async (ApplicationDbContext db) =>
    {
        var designs = await db.KidDesignSubmissions.AsNoTracking()
            .Where(submission => submission.Status == "Published" && submission.IsForSale)
            .OrderByDescending(submission => submission.PublishedAtUtc)
            .Select(submission => new PublicKidDesignResponse(
                submission.Id,
                submission.Title,
                submission.Description,
                submission.AskingPrice,
                submission.SaleCurrency))
            .ToListAsync();

        return Results.Ok(designs);
    });

app.MapPost("/api/kids-corner/offers", async (KidDesignOfferRequest request, ApplicationDbContext db) =>
    {
        var errors = ValidateKidDesignOffer(request);
        if (errors.Count > 0) return Results.ValidationProblem(errors);

        var design = await db.KidDesignSubmissions
            .SingleOrDefaultAsync(submission =>
                submission.Id == request.DesignId &&
                submission.Status == "Published" &&
                submission.IsForSale);
        if (design is null) return Results.NotFound();

        var offer = new KidDesignOffer
        {
            KidDesignSubmissionId = design.Id,
            BuyerName = request.BuyerName!.Trim(),
            BuyerEmail = request.BuyerEmail!.Trim().ToLowerInvariant(),
            OfferAmount = request.OfferAmount,
            Currency = NormalizeCurrency(request.Currency),
            Message = request.Message?.Trim() ?? string.Empty
        };

        db.KidDesignOffers.Add(offer);
        await db.SaveChangesAsync();

        return Results.Created($"/api/kids-corner/offers/{offer.Id}", new { offer.Id, offer.Status });
    });

app.MapGet("/api/team", async (ApplicationDbContext dbContext) =>
    {
        var members = await dbContext.TeamMembers
            .AsNoTracking()
            .Where(member => member.IsActive)
            .OrderBy(member => member.SortOrder)
            .ThenBy(member => member.Name)
            .Select(member => new TeamMemberListing(
                member.Id,
                member.Name,
                member.Role,
                member.Focus,
                member.Description,
                member.SkillsJson,
                member.SortOrder,
                member.IsActive,
                member.UseAccountProfileImage
                    ? member.ApplicationUser != null && member.ApplicationUser.ProfileImage != null
                    : member.Photo != null,
                member.UseAccountProfileImage,
                null,
                null))
            .ToListAsync();
        return Results.Ok(members.Select(ToTeamMemberListingResponse));
    });

app.MapGet("/api/team/{id:int}/photo", async (int id, ApplicationDbContext dbContext) =>
    {
        var member = await dbContext.TeamMembers
            .AsNoTracking()
            .Include(item => item.ApplicationUser)
            .SingleOrDefaultAsync(item => item.Id == id && item.IsActive);
        var photo = member?.UseAccountProfileImage == true
            ? member.ApplicationUser?.ProfileImage
            : member?.Photo;
        var contentType = member?.UseAccountProfileImage == true
            ? member.ApplicationUser?.ProfileImageContentType
            : member?.PhotoContentType;
        return photo is not { Length: > 0 }
            ? Results.NotFound()
            : Results.File(photo, contentType ?? "application/octet-stream");
    });

app.MapGet("/api/team/manage", async (
    ClaimsPrincipal principal,
    UserManager<ApplicationUser> userManager,
    ApplicationDbContext dbContext) =>
    {
        var user = await userManager.GetUserAsync(principal);
        if (user is null || !IsTeamAdmin(user, adminEmail)) return Results.Forbid();

        var members = await dbContext.TeamMembers
            .AsNoTracking()
            .OrderBy(member => member.SortOrder)
            .ThenBy(member => member.Name)
            .Select(member => new TeamMemberListing(
                member.Id,
                member.Name,
                member.Role,
                member.Focus,
                member.Description,
                member.SkillsJson,
                member.SortOrder,
                member.IsActive,
                member.UseAccountProfileImage
                    ? member.ApplicationUser != null && member.ApplicationUser.ProfileImage != null
                    : member.Photo != null,
                member.UseAccountProfileImage,
                member.ApplicationUserId,
                member.ApplicationUser != null ? member.ApplicationUser.Email : null))
            .ToListAsync();
        return Results.Ok(members.Select(ToTeamMemberListingResponse));
    })
    .RequireAuthorization();

app.MapPost("/api/team", async (
    TeamMemberRequest request,
    ClaimsPrincipal principal,
    UserManager<ApplicationUser> userManager,
    ApplicationDbContext dbContext) =>
    {
        var user = await userManager.GetUserAsync(principal);
        if (user is null || !IsTeamAdmin(user, adminEmail)) return Results.Forbid();

        var errors = ValidateTeamMember(request);
        if (errors.Count > 0) return Results.ValidationProblem(errors);
        if (!string.IsNullOrWhiteSpace(request.ApplicationUserId))
        {
            if (await userManager.FindByIdAsync(request.ApplicationUserId) is null)
                return Results.ValidationProblem(new Dictionary<string, string[]> { ["applicationUserId"] = ["Select a registered account."] });
            if (await dbContext.TeamMembers.AnyAsync(item => item.ApplicationUserId == request.ApplicationUserId))
                return Results.ValidationProblem(new Dictionary<string, string[]> { ["applicationUserId"] = ["That account is already linked to another worker."] });
        }
        if (request.UseAccountProfileImage && string.IsNullOrWhiteSpace(request.ApplicationUserId))
            return Results.ValidationProblem(new Dictionary<string, string[]> { ["useAccountProfileImage"] = ["Link a registered account before using its profile photo."] });

        var member = new TeamMember();
        ApplyTeamMember(member, request);
        if (!TryApplyTeamPhoto(member, request, out var photoError))
        {
            return Results.ValidationProblem(new Dictionary<string, string[]> { ["photo"] = [photoError] });
        }

        dbContext.TeamMembers.Add(member);
        await dbContext.SaveChangesAsync();
        return Results.Created($"/api/team/{member.Id}", ToTeamMemberResponse(member));
    })
    .RequireAuthorization();

app.MapPut("/api/team/{id:int}", async (
    int id,
    TeamMemberRequest request,
    ClaimsPrincipal principal,
    UserManager<ApplicationUser> userManager,
    ApplicationDbContext dbContext) =>
    {
        var user = await userManager.GetUserAsync(principal);
        if (user is null || !IsTeamAdmin(user, adminEmail)) return Results.Forbid();

        var member = await dbContext.TeamMembers.FindAsync(id);
        if (member is null) return Results.NotFound();

        var errors = ValidateTeamMember(request);
        if (errors.Count > 0) return Results.ValidationProblem(errors);
        if (!string.IsNullOrWhiteSpace(request.ApplicationUserId))
        {
            if (await userManager.FindByIdAsync(request.ApplicationUserId) is null)
                return Results.ValidationProblem(new Dictionary<string, string[]> { ["applicationUserId"] = ["Select a registered account."] });
            if (await dbContext.TeamMembers.AnyAsync(item => item.Id != id && item.ApplicationUserId == request.ApplicationUserId))
                return Results.ValidationProblem(new Dictionary<string, string[]> { ["applicationUserId"] = ["That account is already linked to another worker."] });
        }
        if (request.UseAccountProfileImage && string.IsNullOrWhiteSpace(request.ApplicationUserId))
            return Results.ValidationProblem(new Dictionary<string, string[]> { ["useAccountProfileImage"] = ["Link a registered account before using its profile photo."] });

        ApplyTeamMember(member, request);
        if (!TryApplyTeamPhoto(member, request, out var photoError))
        {
            return Results.ValidationProblem(new Dictionary<string, string[]> { ["photo"] = [photoError] });
        }

        await dbContext.SaveChangesAsync();
        return Results.Ok(ToTeamMemberResponse(member));
    })
    .RequireAuthorization();

app.MapDelete("/api/team/{id:int}", async (
    int id,
    ClaimsPrincipal principal,
    UserManager<ApplicationUser> userManager,
    ApplicationDbContext dbContext) =>
    {
        var user = await userManager.GetUserAsync(principal);
        if (user is null || !IsTeamAdmin(user, adminEmail)) return Results.Forbid();

        var member = await dbContext.TeamMembers.FindAsync(id);
        if (member is null) return Results.NotFound();

        dbContext.TeamMembers.Remove(member);
        await dbContext.SaveChangesAsync();
        return Results.NoContent();
    })
    .RequireAuthorization();

app.MapGet("/api/health", () => Results.Ok(new { status = "ok" }));

app.Run();

static bool IsTeamAdmin(ApplicationUser user, string adminEmail) =>
    string.Equals(user.Email, adminEmail, StringComparison.OrdinalIgnoreCase);

static bool CanReceiveWork(ApplicationUser user) =>
    user.Role is "Content Writer" or "Worker";

static bool IsValidAccountRole(string? role) =>
    role is "User" or "Content Writer" or "Worker" or "KidCreator" or "ParentReviewer";

static bool CanUseKidDesigns(ApplicationUser user, string adminEmail) =>
    user.Role is "KidCreator" or "ParentReviewer" || IsTeamAdmin(user, adminEmail);

static bool CanReviewKidDesigns(ApplicationUser user, string adminEmail) =>
    user.Role == "ParentReviewer" || IsTeamAdmin(user, adminEmail);

static bool IsValidKidDesignStatus(string? status) =>
    status is "Draft" or "Submitted" or "Approved" or "Published";

static bool IsValidKidDesignOfferStatus(string? status) =>
    status is "New" or "Reviewing" or "Accepted" or "Declined";

static string NormalizeCurrency(string? currency)
{
    var value = currency?.Trim().ToUpperInvariant();
    return value is "USD" ? "USD" : "CAD";
}

static bool IsAllowedSubmissionFile(byte[] bytes, string? contentType, string? fileName)
{
    if (bytes.Length == 0 || string.IsNullOrWhiteSpace(contentType) || string.IsNullOrWhiteSpace(fileName)) return false;
    var extension = Path.GetExtension(Path.GetFileName(fileName)).ToLowerInvariant();
    var type = contentType.ToLowerInvariant();
    return (type, extension) switch
    {
        ("image/jpeg", ".jpg" or ".jpeg") => bytes.Length >= 3 && bytes[0] == 0xff && bytes[1] == 0xd8 && bytes[2] == 0xff,
        ("image/png", ".png") => bytes.Length >= 8 && bytes[..8].SequenceEqual(new byte[] { 137, 80, 78, 71, 13, 10, 26, 10 }),
        ("image/webp", ".webp") => bytes.Length >= 12 && bytes[..4].SequenceEqual("RIFF"u8) && bytes[8..12].SequenceEqual("WEBP"u8),
        ("application/pdf", ".pdf") => bytes.Length >= 5 && bytes[..5].SequenceEqual("%PDF-"u8),
        ("application/vnd.openxmlformats-officedocument.wordprocessingml.document", ".docx") => bytes.Length >= 4 && bytes[0] == 0x50 && bytes[1] == 0x4b && bytes[2] is 0x03 or 0x05 or 0x07 && bytes[3] is 0x04 or 0x06 or 0x08,
        ("text/plain", ".txt") => !bytes.Contains((byte)0),
        _ => false
    };
}

static KidDesignSubmissionResponse ToKidDesignSubmissionResponse(KidDesignSubmission submission) =>
    new(
        submission.Id,
        submission.Title,
        submission.Description,
        submission.DesignLink,
        submission.Status,
        submission.IsForSale,
        submission.AskingPrice,
        submission.SaleCurrency,
        submission.DesignFile is { Length: > 0 },
        submission.DesignFileName,
        submission.CreatedAtUtc,
        submission.UpdatedAtUtc,
        submission.SubmittedAtUtc,
        submission.ReviewedAtUtc,
        submission.PublishedAtUtc,
        submission.OwnerUserId,
        submission.OwnerUser?.DisplayName ?? submission.OwnerUser?.Email,
        submission.ReviewerUserId,
        submission.ReviewerUser?.DisplayName ?? submission.ReviewerUser?.Email);

static KidDesignOfferResponse ToKidDesignOfferResponse(KidDesignOffer offer) =>
    new(
        offer.Id,
        offer.KidDesignSubmissionId,
        offer.KidDesignSubmission?.Title ?? "Design submission",
        offer.KidDesignSubmission?.OwnerUser?.DisplayName ?? offer.KidDesignSubmission?.OwnerUser?.Email,
        offer.BuyerName,
        offer.BuyerEmail,
        offer.OfferAmount,
        offer.Currency,
        offer.Message,
        offer.Status,
        offer.CreatedAtUtc,
        offer.ReviewedAtUtc,
        offer.ReviewerUserId,
        offer.ReviewerUser?.DisplayName ?? offer.ReviewerUser?.Email);

static Dictionary<string, string[]> ValidateKidDesignSubmission(
    KidDesignSubmissionRequest request,
    bool requireContent,
    bool hasExistingFile = false)
{
    var errors = new Dictionary<string, string[]>();
    if (string.IsNullOrWhiteSpace(request.Title)) errors["title"] = ["Title is required."];
    else if (request.Title.Trim().Length > 120) errors["title"] = ["Title must be 120 characters or fewer."];
    if (request.Description?.Trim().Length > 2000) errors["description"] = ["Description must be 2000 characters or fewer."];

    var link = request.DesignLink?.Trim() ?? string.Empty;
    if (link.Length > 500 || (link.Length > 0 && (!Uri.TryCreate(link, UriKind.Absolute, out var uri) || uri.Scheme is not ("http" or "https"))))
        errors["designLink"] = ["Use a valid http or https design link."];

    if (requireContent &&
        string.IsNullOrWhiteSpace(request.Description) &&
        string.IsNullOrWhiteSpace(link) &&
        string.IsNullOrWhiteSpace(request.FileBase64) &&
        (!hasExistingFile || request.RemoveFile))
    {
        errors["submission"] = ["Add a description, link, or file before submitting for review."];
    }

    return errors;
}

static void ApplyKidDesignSubmission(KidDesignSubmission submission, KidDesignSubmissionRequest request)
{
    submission.Title = request.Title!.Trim();
    submission.Description = request.Description?.Trim() ?? string.Empty;
    submission.DesignLink = request.DesignLink?.Trim() ?? string.Empty;
    submission.UpdatedAtUtc = DateTime.UtcNow;
}

static Dictionary<string, string[]> ValidateKidDesignSaleSettings(
    bool isForSale,
    decimal? askingPrice,
    string? saleCurrency,
    string? status)
{
    var errors = new Dictionary<string, string[]>();
    if (isForSale && status != "Published")
        errors["isForSale"] = ["Only published designs can be listed for sale."];
    if (isForSale && (!askingPrice.HasValue || askingPrice <= 0 || askingPrice > 10000))
        errors["askingPrice"] = ["Add an asking price between 0.01 and 10000."];
    if (saleCurrency is not null && NormalizeCurrency(saleCurrency) != saleCurrency.Trim().ToUpperInvariant())
        errors["saleCurrency"] = ["Choose CAD or USD."];
    return errors;
}

static void ApplyKidDesignSaleSettings(
    KidDesignSubmission submission,
    bool isForSale,
    decimal? askingPrice,
    string? saleCurrency)
{
    submission.IsForSale = submission.Status == "Published" && isForSale;
    submission.AskingPrice = submission.IsForSale ? askingPrice : null;
    submission.SaleCurrency = NormalizeCurrency(saleCurrency);
}

static Dictionary<string, string[]> ValidateKidDesignOffer(KidDesignOfferRequest request)
{
    var errors = new Dictionary<string, string[]>();
    if (request.DesignId <= 0) errors["designId"] = ["Choose a published design."];
    if (string.IsNullOrWhiteSpace(request.BuyerName)) errors["buyerName"] = ["Your name is required."];
    else if (request.BuyerName.Trim().Length > 100) errors["buyerName"] = ["Name must be 100 characters or fewer."];

    if (string.IsNullOrWhiteSpace(request.BuyerEmail)) errors["buyerEmail"] = ["Email is required."];
    else
    {
        try
        {
            _ = new MailAddress(request.BuyerEmail.Trim());
        }
        catch (FormatException)
        {
            errors["buyerEmail"] = ["Use a valid email address."];
        }
    }

    if (request.OfferAmount <= 0 || request.OfferAmount > 10000)
        errors["offerAmount"] = ["Offer amount must be between 0.01 and 10000."];
    if (NormalizeCurrency(request.Currency) != request.Currency?.Trim().ToUpperInvariant())
        errors["currency"] = ["Choose CAD or USD."];
    if (request.Message?.Trim().Length > 1200)
        errors["message"] = ["Message must be 1200 characters or fewer."];

    return errors;
}

static bool TryApplyDesignFile(KidDesignSubmission submission, KidDesignSubmissionRequest request, out string error)
{
    error = string.Empty;
    if (request.RemoveFile)
    {
        submission.DesignFile = null;
        submission.DesignFileName = null;
        submission.DesignFileContentType = null;
        return true;
    }

    if (string.IsNullOrWhiteSpace(request.FileBase64)) return true;

    byte[] file;
    try
    {
        file = Convert.FromBase64String(request.FileBase64);
    }
    catch (FormatException)
    {
        error = "The uploaded design file is invalid.";
        return false;
    }

    if (file.Length > 5 * 1024 * 1024)
    {
        error = "The file must be 5 MB or smaller.";
        return false;
    }

    if (!IsAllowedSubmissionFile(file, request.FileContentType, request.FileName))
    {
        error = "Upload a JPEG, PNG, WebP, PDF, Word (.docx), or text file.";
        return false;
    }

    submission.DesignFile = file;
    submission.DesignFileName = Path.GetFileName(request.FileName!);
    submission.DesignFileContentType = request.FileContentType!.ToLowerInvariant();
    return true;
}

static TeamMemberResponse ToTeamMemberResponse(TeamMember member) =>
    new(
        member.Id,
        member.Name,
        member.Role,
        member.Focus,
        member.Description,
        ParseTeamSkills(member.SkillsJson),
        member.SortOrder,
        member.IsActive,
        member.UseAccountProfileImage
            ? member.ApplicationUser?.ProfileImage is { Length: > 0 }
            : member.Photo is { Length: > 0 },
        member.UseAccountProfileImage,
        member.ApplicationUserId,
        member.ApplicationUser?.Email);

static TeamMemberResponse ToTeamMemberListingResponse(TeamMemberListing member) =>
    new(
        member.Id,
        member.Name,
        member.Role,
        member.Focus,
        member.Description,
        ParseTeamSkills(member.SkillsJson),
        member.SortOrder,
        member.IsActive,
        member.HasPhoto,
        member.UseAccountProfileImage,
        member.ApplicationUserId,
        member.ApplicationUserEmail);

static string[] ParseTeamSkills(string skillsJson)
{
    try
    {
        return JsonSerializer.Deserialize<string[]>(skillsJson)?
            .Where(skill => !string.IsNullOrWhiteSpace(skill))
            .ToArray() ?? [];
    }
    catch (JsonException)
    {
        return [];
    }
}

static string[] NormalizeTeamSkills(IEnumerable<string?>? skills) =>
    skills?
        .Where(skill => !string.IsNullOrWhiteSpace(skill))
        .Select(skill => skill!.Trim())
        .Distinct(StringComparer.OrdinalIgnoreCase)
        .ToArray() ?? [];

static Dictionary<string, string[]> ValidateTeamMember(TeamMemberRequest request)
{
    var errors = new Dictionary<string, string[]>();
    if (string.IsNullOrWhiteSpace(request.Name)) errors["name"] = ["Name is required."];
    else if (request.Name.Trim().Length > 100) errors["name"] = ["Name must be 100 characters or fewer."];
    if (string.IsNullOrWhiteSpace(request.Role)) errors["role"] = ["Role is required."];
    else if (request.Role.Trim().Length > 100) errors["role"] = ["Role must be 100 characters or fewer."];
    if (request.Focus?.Trim().Length > 160) errors["focus"] = ["Focus must be 160 characters or fewer."];
    if (request.Description?.Trim().Length > 1000) errors["description"] = ["Description must be 1000 characters or fewer."];
    var skills = NormalizeTeamSkills(request.Skills);
    if (skills.Length > 10 || skills.Any(skill => skill.Length > 40))
        errors["skills"] = ["Add up to 10 skills, each 40 characters or fewer."];
    return errors;
}

static void ApplyTeamMember(TeamMember member, TeamMemberRequest request)
{
    member.Name = request.Name!.Trim();
    member.Role = request.Role!.Trim();
    member.Focus = request.Focus?.Trim() ?? string.Empty;
    member.Description = request.Description?.Trim() ?? string.Empty;
    member.SkillsJson = JsonSerializer.Serialize(NormalizeTeamSkills(request.Skills));
    member.SortOrder = request.SortOrder;
    member.IsActive = request.IsActive;
    member.ApplicationUserId = string.IsNullOrWhiteSpace(request.ApplicationUserId) ? null : request.ApplicationUserId;
    member.UseAccountProfileImage = request.UseAccountProfileImage;
}

static bool TryApplyTeamPhoto(TeamMember member, TeamMemberRequest request, out string error)
{
    error = string.Empty;
    if (request.RemovePhoto)
    {
        member.Photo = null;
        member.PhotoContentType = null;
        return true;
    }
    if (string.IsNullOrWhiteSpace(request.PhotoBase64)) return true;

    var allowedTypes = new HashSet<string>(StringComparer.OrdinalIgnoreCase)
    {
        "image/jpeg", "image/png", "image/webp"
    };
    if (request.PhotoContentType is null || !allowedTypes.Contains(request.PhotoContentType))
    {
        error = "Worker photo must be a JPEG, PNG, or WebP image.";
        return false;
    }
    try
    {
        member.Photo = Convert.FromBase64String(request.PhotoBase64);
    }
    catch (FormatException)
    {
        error = "The uploaded worker photo is invalid.";
        return false;
    }
    if (member.Photo.Length > 2 * 1024 * 1024)
    {
        member.Photo = null;
        error = "Worker photo must be 2 MB or smaller.";
        return false;
    }
    member.PhotoContentType = request.PhotoContentType.ToLowerInvariant();
    return true;
}

internal sealed record UpdateProfileRequest(
    string? DisplayName,
    string? ProfileImageBase64,
    string? ProfileImageContentType,
    bool RemoveProfileImage = false);

internal sealed record RoleRequest(string? Role);
internal sealed record TaskRequest(string? Title, string? Instructions, DateTime? DueAtUtc, string? AssignedToUserId);
internal sealed record TaskStatusRequest(string Status);
internal sealed record SubmissionRequest(string? Content, string? Notes, string? Link, string? FileName, string? FileContentType, string? FileBase64);

internal sealed record KidDesignSubmissionRequest(
    string? Title,
    string? Description,
    string? DesignLink,
    string? FileName,
    string? FileContentType,
    string? FileBase64,
    bool Submit,
    bool RemoveFile = false);

internal sealed record KidDesignStatusRequest(
    string? Status,
    bool IsForSale,
    decimal? AskingPrice,
    string? SaleCurrency);

internal sealed record KidDesignOfferRequest(
    int DesignId,
    string? BuyerName,
    string? BuyerEmail,
    decimal OfferAmount,
    string? Currency,
    string? Message);

internal sealed record KidDesignOfferStatusRequest(string? Status);

internal sealed record PublicKidDesignResponse(
    int Id,
    string Title,
    string Description,
    decimal? AskingPrice,
    string SaleCurrency);

internal sealed record KidDesignSubmissionResponse(
    int Id,
    string Title,
    string Description,
    string DesignLink,
    string Status,
    bool IsForSale,
    decimal? AskingPrice,
    string SaleCurrency,
    bool HasDesignFile,
    string? DesignFileName,
    DateTime CreatedAtUtc,
    DateTime UpdatedAtUtc,
    DateTime? SubmittedAtUtc,
    DateTime? ReviewedAtUtc,
    DateTime? PublishedAtUtc,
    string OwnerUserId,
    string? OwnerName,
    string? ReviewerUserId,
    string? ReviewerName);

internal sealed record KidDesignOfferResponse(
    int Id,
    int KidDesignSubmissionId,
    string DesignTitle,
    string? OwnerName,
    string BuyerName,
    string BuyerEmail,
    decimal OfferAmount,
    string Currency,
    string Message,
    string Status,
    DateTime CreatedAtUtc,
    DateTime? ReviewedAtUtc,
    string? ReviewerUserId,
    string? ReviewerName);

internal sealed record TeamMemberRequest(
    string? Name,
    string? Role,
    string? Focus,
    string? Description,
    string[]? Skills,
    int SortOrder,
    bool IsActive,
    string? ApplicationUserId,
    bool UseAccountProfileImage,
    string? PhotoBase64,
    string? PhotoContentType,
    bool RemovePhoto);

internal sealed record TeamMemberResponse(
    int Id,
    string Name,
    string Role,
    string Focus,
    string Description,
    string[] Skills,
    int SortOrder,
    bool IsActive,
    bool HasPhoto,
    bool UseAccountProfileImage,
    string? ApplicationUserId,
    string? ApplicationUserEmail);

internal sealed record TeamMemberListing(
    int Id,
    string Name,
    string Role,
    string Focus,
    string Description,
    string SkillsJson,
    int SortOrder,
    bool IsActive,
    bool HasPhoto,
    bool UseAccountProfileImage,
    string? ApplicationUserId,
    string? ApplicationUserEmail);
