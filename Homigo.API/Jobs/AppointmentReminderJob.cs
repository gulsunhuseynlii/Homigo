using Homigo.API.Interfaces;

namespace Homigo.API.Jobs;

public class AppointmentReminderJob
{
    private readonly IOrderService _orderService;

    public AppointmentReminderJob(IOrderService orderService)
    {
        _orderService = orderService;
    }

    public async Task ExecuteAsync()
    {
        await _orderService.SendAppointmentRemindersAsync();
    }
}