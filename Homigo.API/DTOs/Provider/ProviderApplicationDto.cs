public class ProviderApplicationDto
{
    public int UserId { get; set; }

    public string FullName { get; set; } = string.Empty;

    public string PhoneNumber { get; set; } = string.Empty;

    public string CategoryName { get; set; } = string.Empty;

    public string Bio { get; set; } = string.Empty;

    public int YearsOfExperience { get; set; }

    public string? CvUrl { get; set; }

    public string? IdentityCardUrl { get; set; }

    public string? CertificateUrl { get; set; }

    public string? ProfileImageUrl { get; set; }
}