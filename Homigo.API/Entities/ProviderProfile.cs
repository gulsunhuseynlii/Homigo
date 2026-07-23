using Homigo.API.Entities;

public class ProviderProfile : BaseEntity
{
    public int UserId { get; set; }

    public User User { get; set; } = null!;
    public string PhoneNumber { get; set; } = string.Empty;

    public string Bio { get; set; } = string.Empty;

    public int YearsOfExperience { get; set; }

    public bool IsApproved { get; set; }

    public string? ProfileImageUrl { get; set; }

    public string? CvUrl { get; set; }

    public string? IdentityCardUrl { get; set; }

    public string? CertificateUrl { get; set; }

    public ICollection<Service> Services { get; set; }
        = new List<Service>();

    public ICollection<Review> Reviews { get; set; }
        = new List<Review>();
    public int CategoryId { get; set; }

    public Category Category { get; set; } = null!;
}