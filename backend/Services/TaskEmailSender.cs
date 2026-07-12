using System.Net;
using System.Net.Mail;
using System.Text.Encodings.Web;
using GlennLuna.Api.Models;

namespace GlennLuna.Api.Services;

public interface ITaskEmailSender
{
    Task SendAssignmentAsync(ApplicationUser worker, ContentTask task);
}

public sealed class TaskEmailSender(IConfiguration configuration) : ITaskEmailSender
{
    public async Task SendAssignmentAsync(ApplicationUser worker, ContentTask task)
    {
        if (string.IsNullOrWhiteSpace(worker.Email))
            throw new InvalidOperationException("The assigned worker does not have an email address.");

        var host = Required("SMTP_HOST");
        var username = Required("SMTP_USER");
        var password = Required("SMTP_PASS");
        var port = int.TryParse(configuration["SMTP_PORT"], out var value) ? value : 587;
        var secure = !bool.TryParse(configuration["SMTP_SECURE"], out var configured) || configured;
        var from = configuration["AUTH_FROM_EMAIL"] ?? configuration["QUOTE_FROM_EMAIL"] ?? username;
        var appUrl = (configuration["PUBLIC_APP_URL"] ?? configuration["FrontendUrl"] ?? "http://localhost:3003").TrimEnd('/');
        var encode = HtmlEncoder.Default;
        var due = task.DueAtUtc is null ? "No deadline was specified." : $"Due: {task.DueAtUtc.Value:u}";

        using var message = new MailMessage
        {
            From = new MailAddress(from, "Glenn Luna"),
            Subject = $"New writing task: {task.Title}",
            IsBodyHtml = true,
            Body = $"""
                <p>Hello {encode.Encode(worker.DisplayName ?? worker.Email)},</p>
                <p>A new content-writing task has been assigned to you.</p>
                <h2>{encode.Encode(task.Title)}</h2>
                <p>{encode.Encode(task.Instructions).Replace("\n", "<br>")}</p>
                <p><strong>{encode.Encode(due)}</strong></p>
                <p><a href="{encode.Encode(appUrl + "/dashboard")}">Open your work dashboard</a></p>
                """
        };
        message.To.Add(worker.Email);
        using var client = new SmtpClient(host, port) { EnableSsl = secure, Credentials = new NetworkCredential(username, password) };
        await client.SendMailAsync(message);
    }

    private string Required(string key) => configuration[key]
        ?? throw new InvalidOperationException($"Missing required configuration value: {key}");
}
