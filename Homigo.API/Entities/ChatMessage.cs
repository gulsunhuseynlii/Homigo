namespace Homigo.API.Entities;

public class ChatMessage : BaseEntity
{
    public int OrderId { get; set; }
    public Order Order { get; set; } = null!;

    public int SenderId { get; set; }
    public User Sender { get; set; } = null!;

    public int ReceiverId { get; set; }
    public User Receiver { get; set; } = null!;

    public string Message { get; set; } = string.Empty;

    public bool IsRead { get; set; } = false;
}