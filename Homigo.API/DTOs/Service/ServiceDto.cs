namespace Homigo.API.DTOs.Service;

public class ServiceDto
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public decimal BasePrice { get; set; }

    public int EstimatedMinutes { get; set; }

    public string? ImageUrl { get; set; }

    public int ProviderId { get; set; }

    public string ProviderName { get; set; } = string.Empty;

    public string CategoryName { get; set; } = string.Empty;
}