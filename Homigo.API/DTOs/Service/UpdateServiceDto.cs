namespace Homigo.API.DTOs.Service;

public class UpdateServiceDto
{
    public string Name { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public decimal BasePrice { get; set; }

    public int EstimatedMinutes { get; set; }

    public string? ImageUrl { get; set; }
}