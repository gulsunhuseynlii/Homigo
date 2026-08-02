using Homigo.API.Interfaces;
using Microsoft.Extensions.Logging;

namespace Homigo.API.Jobs;

public class ExpiredOrderJob
{
    private readonly IOrderService _orderService;

    public ExpiredOrderJob(IOrderService orderService)
    {
        _orderService = orderService;
    }

    public async Task ExecuteAsync()
    {
        await _orderService.AutoCancelExpiredOrdersAsync();
    }
}