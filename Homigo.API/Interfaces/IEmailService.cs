namespace Homigo.API.Interfaces;

public interface IEmailService
{
    Task SendEmailAsync(
        string to,
        string subject,
        string body);
    Task SendProviderApprovedEmailAsync(string email, string fullName);
    Task SendOrderCompletedEmailAsync(
    string email,
    string fullName);
    Task SendOrderAcceptedEmailAsync(
    string email,
    string fullName);
    Task SendAppointmentReminderEmailAsync(
    string email,
    string fullName,
    string serviceName,
    DateTime scheduledDate);
}