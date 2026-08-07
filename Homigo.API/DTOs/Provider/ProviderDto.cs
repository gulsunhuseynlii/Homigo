using Homigo.API.DTOs.Service;

namespace Homigo.API.DTOs.Provider;

public class ProviderDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string FullName { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string PhoneNumber { get; set; } = string.Empty;

    public string Experience { get; set; } = string.Empty;

    public string Bio { get; set; } = string.Empty;

    public double AverageRating { get; set; }
    public string? ProfileImageUrl { get; set; }
    public string CategoryName { get; set; } = string.Empty;
    public int YearsOfExperience { get; set; }

    public int ReviewCount { get; set; }

    public int CompletedOrders { get; set; }

    public List<ServiceDto> Services { get; set; } = [];
}