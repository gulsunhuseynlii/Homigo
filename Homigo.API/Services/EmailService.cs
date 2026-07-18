using Homigo.API.Configurations;
using Homigo.API.Interfaces;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Options;
using MimeKit;

namespace Homigo.API.Services;

public class EmailService : IEmailService
{
    private readonly EmailSettings _emailSettings;

    public EmailService(IOptions<EmailSettings> options)
    {
        _emailSettings = options.Value;
    }

    public async Task SendEmailAsync(
        string to,
        string subject,
        string body)
    {
        var email = new MimeMessage();

        email.From.Add(
            new MailboxAddress(
                _emailSettings.DisplayName,
                _emailSettings.Email));

        email.To.Add(
            MailboxAddress.Parse(to));

        email.Subject = subject;

        email.Body = new TextPart("html")
        {
            Text = body
        };

        using var smtp = new SmtpClient();

        await smtp.ConnectAsync(
            _emailSettings.Host,
            _emailSettings.Port,
            SecureSocketOptions.StartTls);

        await smtp.AuthenticateAsync(
            _emailSettings.Email,
            _emailSettings.Password);

        await smtp.SendAsync(email);

        await smtp.DisconnectAsync(true);
    }
}