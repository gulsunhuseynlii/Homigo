using Homigo.API.DTOs.Chat;

namespace Homigo.API.Interfaces;

public interface IChatService
{
    Task SendMessageAsync(int senderId, SendMessageDto dto);

    Task<List<ChatMessageDto>> GetMessagesAsync(
        int orderId,
        int currentUserId);

    Task<int> GetUnreadCountAsync(int userId);
    Task<int> GetUnreadCountAsync(
    int userId,
    int orderId);
}