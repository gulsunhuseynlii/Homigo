namespace Homigo.API.Entities;

public class Service : BaseEntity
{
    public string Name { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public decimal BasePrice { get; set; }

    public string? ImageUrl { get; set; }

    public int EstimatedMinutes { get; set; }

    public bool IsActive { get; set; } = true;

    public int ProviderId { get; set; }

    public ProviderProfile Provider { get; set; } = null!;
    public ICollection<Order> Orders { get; set; } = new List<Order>();
    public ICollection<Favorite> Favorites { get; set; } = new List<Favorite>();
  
}