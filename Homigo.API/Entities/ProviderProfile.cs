namespace Homigo.API.Entities;

public class ProviderProfile : BaseEntity
{
    public int UserId { get; set; }

    public User User { get; set; } = null!;

    public string Bio { get; set; } = string.Empty;

    public int YearsOfExperience { get; set; }

    public double AverageRating { get; set; }

    public bool IsApproved { get; set; }

    public string? ProfileImageUrl { get; set; }
}