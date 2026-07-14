namespace Homigo.API.DTOs.Provider;

public class ProviderApplicationDto
{
    public int UserId { get; set; }

    public string FullName { get; set; } = string.Empty;

    public string Bio { get; set; } = string.Empty;

    public int YearsOfExperience { get; set; }

    public bool IsApproved { get; set; }
}