using Microsoft.AspNetCore.Http;

public class CreateServiceDto
{
    public string Name { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public decimal BasePrice { get; set; }

    public int EstimatedMinutes { get; set; }

    public IFormFile? Image { get; set; }
}