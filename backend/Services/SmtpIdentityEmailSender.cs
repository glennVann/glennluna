using System.Net;
using System.Net.Mail;
using System.Text.Encodings.Web;
using GlennLuna.Api.Models;
using Microsoft.AspNetCore.Identity;

namespace GlennLuna.Api.Services;

public sealed class SmtpIdentityEmailSender(IConfiguration configuration)
    : IEmailSender<ApplicationUser>
{
    public Task SendConfirmationLinkAsync(
        ApplicationUser user,
        string email,
        string confirmationLink) =>
        SendAsync(
            email,
            "Confirm your Glenn Luna account",
            $"""
            <p>Hello,</p>
            <p>Please confirm your Glenn Luna account by clicking the link below:</p>
            <p><a href="{HtmlEncoder.Default.Encode(ToPublicLink(confirmationLink))}">Confirm email address</a></p>
            <p>If you did not create this account, you can ignore this message.</p>
            """);

    public Task SendPasswordResetLinkAsync(
        ApplicationUser user,
        string email,
        string resetLink) =>
        SendAsync(
            email,
            "Reset your Glenn Luna password",
            $"""
            <p>Hello,</p>
            <p>Reset your password using the link below:</p>
            <p><a href="{HtmlEncoder.Default.Encode(resetLink)}">Reset password</a></p>
            <p>If you did not request this reset, you can ignore this message.</p>
            """);

    public Task SendPasswordResetCodeAsync(
        ApplicationUser user,
        string email,
        string resetCode) =>
        SendAsync(
            email,
            "Your Glenn Luna password reset code",
            $"<p>Your password reset code is: <strong>{HtmlEncoder.Default.Encode(resetCode)}</strong></p>");

    private async Task SendAsync(string recipient, string subject, string htmlBody)
    {
        var host = GetRequiredValue("SMTP_HOST");
        var username = GetRequiredValue("SMTP_USER");
        var password = GetRequiredValue("SMTP_PASS");
        var port = int.TryParse(configuration["SMTP_PORT"], out var configuredPort)
            ? configuredPort
            : 587;
        var enableSsl = !bool.TryParse(configuration["SMTP_SECURE"], out var configuredSecure)
            || configuredSecure;
        var fromAddress = configuration["AUTH_FROM_EMAIL"]
            ?? configuration["QUOTE_FROM_EMAIL"]
            ?? username;

        using var message = new MailMessage
        {
            From = new MailAddress(fromAddress, "Glenn Luna"),
            Subject = subject,
            Body = htmlBody,
            IsBodyHtml = true
        };
        message.To.Add(recipient);

        using var client = new SmtpClient(host, port)
        {
            EnableSsl = enableSsl,
            Credentials = new NetworkCredential(username, password)
        };

        await client.SendMailAsync(message);
    }

    private string GetRequiredValue(string name) =>
        configuration[name]
        ?? throw new InvalidOperationException($"Missing required configuration value: {name}");

    private string ToPublicLink(string internalLink)
    {
        var decodedLink = WebUtility.HtmlDecode(internalLink);
        var publicAppUrl = configuration["PUBLIC_APP_URL"];
        if (string.IsNullOrWhiteSpace(publicAppUrl) || !Uri.TryCreate(decodedLink, UriKind.Absolute, out var link))
        {
            return decodedLink;
        }

        return new Uri(new Uri(publicAppUrl.TrimEnd('/') + "/"), link.PathAndQuery.TrimStart('/')).ToString();
    }
}
