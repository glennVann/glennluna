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
            : Results.Ok(new { user.Id, user.Email, user.UserName });
    })
    .RequireAuthorization();

app.MapGet("/api/health", () => Results.Ok(new { status = "ok" }));

app.Run();
