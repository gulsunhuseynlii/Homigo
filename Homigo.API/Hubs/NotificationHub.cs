using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;

namespace Homigo.API.Hubs;

public class NotificationHub : Hub
{
    public override async Task OnConnectedAsync()
    {
        var userId = Context.UserIdentifier;

        Console.WriteLine($"CONNECTED UserId: {userId}");
        Console.WriteLine($"ConnectionId: {Context.ConnectionId}");

        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        Console.WriteLine($"DISCONNECTED UserId: {Context.UserIdentifier}");
        Console.WriteLine($"ConnectionId: {Context.ConnectionId}");

        await base.OnDisconnectedAsync(exception);
    }

}