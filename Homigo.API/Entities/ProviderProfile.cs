namespace Homigo.API.Entities;

public class ProviderProfile : BaseEntity
{
    public int UserId { get; set; }

    public User User { get; set; } = null!;

    public string Bio { get; set; } = string.Empty;

    public int YearsOfExperience { get; set; }

    public bool IsApproved { get; set; }

    public string? ProfileImageUrl { get; set; }

    public ICollection<Review> Reviews { get; set; }
        = new List<Review>();
    public ICollection<Service> Services { get; set; }
       = new List<Service>();
}