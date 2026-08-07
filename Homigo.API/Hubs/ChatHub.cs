using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;

namespace Homigo.API.Hubs;

[Authorize]
public class ChatHub : Hub
{
    public override async Task OnConnectedAsync()
    {
        Console.WriteLine($"CHAT CONNECTED: {Context.UserIdentifier}");

        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        Console.WriteLine($"CHAT DISCONNECTED: {Context.UserIdentifier}");

        await base.OnDisconnectedAsync(exception);
    }
    public async Task MarkAsRead(int orderId)
    {
        await Clients.Others.SendAsync(
            "MessagesRead",
            orderId);
    }
}