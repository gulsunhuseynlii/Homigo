using Homigo.API.Data;
using Homigo.API.Entities;
using Homigo.API.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Homigo.API.Repositories.Implementations;

public class ChatRepository : IChatRepository
{
    private readonly AppDbContext _context;

    public ChatRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task AddMessageAsync(ChatMessage message)
    {
        await _context.ChatMessages.AddAsync(message);
    }

    public async Task<List<ChatMessage>> GetMessagesAsync(int orderId)
    {
        return await _context.ChatMessages
            .Include(x => x.Sender)
            .Where(x => x.OrderId == orderId)
            .OrderBy(x => x.CreatedAt)
            .ToListAsync();
    }

    public async Task<Order?> GetOrderAsync(int orderId)
    {
        return await _context.Orders
            .Include(x => x.Customer)
            .Include(x => x.Provider)
            .FirstOrDefaultAsync(x => x.Id == orderId);
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
    public async Task MarkMessagesAsReadAsync(
    int orderId,
    int currentUserId)
    {
        var messages = await _context.ChatMessages
            .Where(x =>
                x.OrderId == orderId &&
                x.ReceiverId == currentUserId &&
                !x.IsRead)
            .ToListAsync();

        foreach (var message in messages)
        {
            message.IsRead = true;
        }

        await _context.SaveChangesAsync();
    }
}