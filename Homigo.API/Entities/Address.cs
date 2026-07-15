namespace Homigo.API.Entities;

public class Address : BaseEntity
{
    public int UserId { get; set; }

    public User User { get; set; } = null!;

    public string Title { get; set; } = string.Empty;

    public string City { get; set; } = string.Empty;

    public string District { get; set; } = string.Empty;

    public string Street { get; set; } = string.Empty;

    public string Building { get; set; } = string.Empty;

    public string Apartment { get; set; } = string.Empty;

    public string? Notes { get; set; }

    public bool IsDefault { get; set; }
    public ICollection<Order> Orders { get; set; } = new List<Order>();
}