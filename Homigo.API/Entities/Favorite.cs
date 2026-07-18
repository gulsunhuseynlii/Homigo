namespace Homigo.API.Entities;

public class Favorite
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public User User { get; set; } = null!;

    public int ServiceId { get; set; }

    public Service Service { get; set; } = null!;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}