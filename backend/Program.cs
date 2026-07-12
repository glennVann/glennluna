using GlennLuna.Api.Data;
using GlennLuna.Api.Configuration;
using GlennLuna.Api.Models;
using GlennLuna.Api.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
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
            HasProfileImage = user.ProfileImage is { Length: > 0 },
            IsTeamAdmin = IsTeamAdmin(user, adminEmail)
        });
    })
    .RequireAuthorization();

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
                member.Photo != null))
            .ToListAsync();
        return Results.Ok(members.Select(ToTeamMemberListingResponse));
    });

app.MapGet("/api/team/{id:int}/photo", async (int id, ApplicationDbContext dbContext) =>
    {
        var member = await dbContext.TeamMembers
            .AsNoTracking()
            .SingleOrDefaultAsync(item => item.Id == id && item.IsActive);
        return member?.Photo is not { Length: > 0 } photo
            ? Results.NotFound()
            : Results.File(photo, member.PhotoContentType ?? "application/octet-stream");
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
                member.Photo != null))
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
        member.Photo is { Length: > 0 });

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
        member.HasPhoto);

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

internal sealed record TeamMemberRequest(
    string? Name,
    string? Role,
    string? Focus,
    string? Description,
    string[]? Skills,
    int SortOrder,
    bool IsActive,
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
    bool HasPhoto);

internal sealed record TeamMemberListing(
    int Id,
    string Name,
    string Role,
    string Focus,
    string Description,
    string SkillsJson,
    int SortOrder,
    bool IsActive,
    bool HasPhoto);
