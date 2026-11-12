using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Homigo.API.Repositories.Interfaces;
using System.Security.Claims;

namespace Homigo.API.Hubs;

[Authorize]
public class ChatHub : Hub
{
    private readonly IChatRepository _chatRepository;

    public ChatHub(IChatRepository chatRepository)
    {
        _chatRepository = chatRepository;
    }

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

    public async Task StartTyping(int orderId)
    {
        var order = await _chatRepository.GetOrderAsync(orderId);

        if (order == null)
            return;

        var currentUserId = int.Parse(
            Context.User!.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var receiverId =
            order.CustomerId == currentUserId
                ? order.ProviderId!.Value
                : order.CustomerId;

        await Clients.User(receiverId.ToString())
            .SendAsync("UserTyping", orderId);
    }

    public async Task StopTyping(int orderId)
    {
        var order = await _chatRepository.GetOrderAsync(orderId);

        if (order == null)
            return;

        var currentUserId = int.Parse(
            Context.User!.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var receiverId =
            order.CustomerId == currentUserId
                ? order.ProviderId!.Value
                : order.CustomerId;

        await Clients.User(receiverId.ToString())
            .SendAsync("UserStoppedTyping", orderId);
    }
}