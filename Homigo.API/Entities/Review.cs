namespace Homigo.API.Entities;

public class Review
{
    public int Id { get; set; }

    public int OrderId { get; set; }

    public Order Order { get; set; } = null!;

    public int CustomerId { get; set; }

    public User Customer { get; set; } = null!;

    public int ProviderId { get; set; }

    public User Provider { get; set; } = null!;

    public int Rating { get; set; }

    public string Comment { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}