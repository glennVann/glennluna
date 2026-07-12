using GlennLuna.Api.Data;
using GlennLuna.Api.Configuration;
using GlennLuna.Api.Models;
using GlennLuna.Api.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

var builder = WebApplication.CreateBuilder(args);

DotEnvConfiguration.AddMissingValues(builder.Configuration, builder.Environment.ContentRootPath);

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? throw new InvalidOperationException(
        "Connection string 'DefaultConnection' was not configured. " +
        "Set ConnectionStrings__DefaultConnection or use dotnet user-secrets.");

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
                HasProfileImage = user.ProfileImage is { Length: > 0 }
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
            HasProfileImage = user.ProfileImage is { Length: > 0 }
        });
    })
    .RequireAuthorization();

app.MapGet("/api/health", () => Results.Ok(new { status = "ok" }));

app.Run();

internal sealed record UpdateProfileRequest(
    string? DisplayName,
    string? ProfileImageBase64,
    string? ProfileImageContentType,
    bool RemoveProfileImage = false);
