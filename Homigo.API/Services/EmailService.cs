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
    public async Task SendProviderApprovedEmailAsync(
    string email,
    string fullName)
    {
        var subject = "Homigo - Provider Application Approved";

        var body = $@"
        <h2>Congratulations, {fullName}! 🎉</h2>

        <p>Your provider application has been approved.</p>

        <p>You can now login and start receiving customer orders.</p>

        <br/>

        <p>Thank you for choosing <b>Homigo</b>.</p>";

        await SendEmailAsync(email, subject, body);
    }
    public async Task SendOrderCompletedEmailAsync(
    string email,
    string fullName)
    {
        var subject = "Homigo - Service Completed";

        var body = $@"
    <h2>Hello, {fullName}! 👋</h2>

    <p>Your service has been completed successfully.</p>

    <p>Thank you for choosing <b>Homigo</b>.</p>

    <p>⭐ Don't forget to leave a review for your provider.</p>

    <br/>

    <p>We hope to see you again!</p>";

        await SendEmailAsync(email, subject, body);
    }
    public async Task SendOrderAcceptedEmailAsync(
    string email,
    string fullName)
    {
        var subject = "Homigo - Your Order Has Been Accepted";

        var body = $@"
    <h2>Hello, {fullName}! 🎉</h2>

    <p>Great news!</p>

    <p>Your order has been accepted by the provider.</p>

    <p>The provider will arrive on your scheduled date and time.</p>

    <br/>

    <p>Thank you for choosing <b>Homigo</b>.</p>";

        await SendEmailAsync(email, subject, body);
    }
    public async Task SendAppointmentReminderEmailAsync(
    string email,
    string fullName,
    string serviceName,
    DateTime scheduledDate)
    {
        var subject = "Homigo - Appointment Reminder";

        var body = $@"
    <h2>Hello, {fullName}! 👋</h2>

    <p>This is a friendly reminder about your upcoming service.</p>

    <p><strong>Service:</strong> {serviceName}</p>

    <p><strong>Date:</strong> {scheduledDate:dd MMM yyyy}</p>

    <p><strong>Time:</strong> {scheduledDate:HH:mm}</p>

    <br/>

    <p>We look forward to serving you.</p>

    <p>Thank you for choosing <b>Homigo</b>.</p>";

        await SendEmailAsync(email, subject, body);
    }
}