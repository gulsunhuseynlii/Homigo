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
    private readonly IFileService _fileService;

    public ChatService(
        IChatRepository chatRepository,
        IHubContext<ChatHub> hubContext,
        IFileService fileService)
    {
        _chatRepository = chatRepository;
        _hubContext = hubContext;
        _fileService = fileService;
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

        string? imageUrl = null;

        if (dto.File != null)
        {
            imageUrl = await _fileService.UploadAsync(
                dto.File,
                "chat",
                ".jpg",
                ".jpeg",
                ".png");
        }

        var message = new ChatMessage
        {
            OrderId = dto.OrderId,
            SenderId = senderId,
            ReceiverId = receiverId,
            Message = dto.Message,
            ImageUrl = imageUrl
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
                    imageUrl,
                    createdAt = message.CreatedAt
                });

        var unreadCount =
            await _chatRepository.GetUnreadCountAsync(
                receiverId);

        await _hubContext
            .Clients
            .User(receiverId.ToString())
            .SendAsync(
                "UnreadCountChanged",
                unreadCount);
    }

    public async Task<List<ChatMessageDto>> GetMessagesAsync(
        int orderId,
        int currentUserId)
    {
        await _chatRepository.MarkMessagesAsReadAsync(
            orderId,
            currentUserId);

        var unreadCount =
            await _chatRepository.GetUnreadCountAsync(
                currentUserId);

        await _hubContext
            .Clients
            .User(currentUserId.ToString())
            .SendAsync(
                "UnreadCountChanged",
                unreadCount);

        var order =
            await _chatRepository.GetOrderAsync(orderId);

        if (order == null)
            throw new NotFoundException("Order not found.");

        int senderId =
            order.CustomerId == currentUserId
                ? order.ProviderId!.Value
                : order.CustomerId;

        await _hubContext
            .Clients
            .User(senderId.ToString())
            .SendAsync(
                "MessagesRead",
                orderId);

        var messages =
            await _chatRepository.GetMessagesAsync(orderId);

        return messages
            .Select(x => new ChatMessageDto
            {
                Id = x.Id,
                SenderId = x.SenderId,
                SenderName = x.Sender.FullName,
                Message = x.Message,
                ImageUrl = x.ImageUrl,
                CreatedAt = x.CreatedAt,
                IsMine = x.SenderId == currentUserId,
                IsRead = x.IsRead
            })
            .ToList();
    }

    public async Task<int> GetUnreadCountAsync(int userId)
    {
        return await _chatRepository
            .GetUnreadCountAsync(userId);
    }

    public async Task<int> GetUnreadCountAsync(
        int userId,
        int orderId)
    {
        return await _chatRepository
            .GetUnreadCountAsync(
                userId,
                orderId);
    }
}