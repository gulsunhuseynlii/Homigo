using Homigo.API.Entities;

namespace Homigo.API.Repositories.Interfaces;

public interface IChatRepository
{
    Task AddMessageAsync(ChatMessage message);

    Task<List<ChatMessage>> GetMessagesAsync(int orderId);

    Task<Order?> GetOrderAsync(int orderId);

    Task SaveChangesAsync();
    Task MarkMessagesAsReadAsync(int orderId, int currentUserId);
}