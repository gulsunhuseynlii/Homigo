namespace Homigo.API.Entities;

public class User : BaseEntity
{
    public string FullName { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string PasswordHash { get; set; } = string.Empty;

    public string PhoneNumber { get; set; } = string.Empty;

    public string? ProfileImageUrl { get; set; }

    public bool IsActive { get; set; } = true;

    public int RoleId { get; set; }

    public Role Role { get; set; } = null!;
    public ProviderProfile? ProviderProfile { get; set; }
    public ICollection<Address> Addresses { get; set; } = new List<Address>();
    public ICollection<Order> CustomerOrders { get; set; } = new List<Order>();

    public ICollection<Order> ProviderOrders { get; set; } = new List<Order>();
    public ICollection<Review> CustomerReviews { get; set; } = new List<Review>();

    public ICollection<Review> ProviderReviews { get; set; } = new List<Review>();
    public ICollection<Favorite> Favorites { get; set; } = new List<Favorite>();
}