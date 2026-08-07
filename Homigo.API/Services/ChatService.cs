using Homigo.API.DTOs.Chat;
using Homigo.API.Entities;
using Homigo.API.Exceptions;
using Homigo.API.Hubs;
using Homigo.API.Interfaces;
using Homigo.API.Repositories.Interfaces;
using Microsoft.AspNetCore.SignalR;

namespace Homigo.API.Services;

public class ChatService : IChatService
{
    private readonly IChatRepository _chatRepository;
    private readonly IHubContext<ChatHub> _hubContext;
    public ChatService(
     IChatRepository chatRepository,
     IHubContext<ChatHub> hubContext)
    {
        _chatRepository = chatRepository;
        _hubContext = hubContext;
    }

    public async Task SendMessageAsync(
        int senderId,
        SendMessageDto dto)
    {
        var order =
            await _chatRepository.GetOrderAsync(dto.OrderId);

        if (order == null)
            throw new NotFoundException("Order not found.");

        if (order.ProviderId == null)
            throw new NotFoundException("Provider not found.");

        int receiverId =
            order.CustomerId == senderId
                ? order.ProviderId.Value
                : order.CustomerId;

        var message = new ChatMessage
        {
            OrderId = dto.OrderId,
            SenderId = senderId,
            ReceiverId = receiverId,
            Message = dto.Message
        };

        await _chatRepository.AddMessageAsync(message);

        await _chatRepository.SaveChangesAsync();
        await _hubContext
    .Clients
    .User(receiverId.ToString())
    .SendAsync(
        "ReceiveMessage",
        new
        {
            orderId = dto.OrderId,
            senderId,
            message = dto.Message,
            createdAt = message.CreatedAt
        });
    }

    public async Task<List<ChatMessageDto>> GetMessagesAsync(
     int orderId,
     int currentUserId)
    {
        await _chatRepository.MarkMessagesAsReadAsync(
            orderId,
            currentUserId);

        var order =
            await _chatRepository.GetOrderAsync(orderId);

        int senderId =
            order!.CustomerId == currentUserId
                ? order.ProviderId!.Value
                : order.CustomerId;

        Console.WriteLine($"Sending MessagesRead to user: {senderId}");

        await _hubContext
            .Clients
            .User(senderId.ToString())
            .SendAsync("MessagesRead", orderId);

        Console.WriteLine("MessagesRead event sent.");

        var messages =
            await _chatRepository.GetMessagesAsync(orderId);

        return messages.Select(x => new ChatMessageDto
        {
            Id = x.Id,
            SenderId = x.SenderId,
            SenderName = x.Sender.FullName,
            Message = x.Message,
            CreatedAt = x.CreatedAt,
            IsMine = x.SenderId == currentUserId,
            IsRead = x.IsRead
        }).ToList();
    }
}