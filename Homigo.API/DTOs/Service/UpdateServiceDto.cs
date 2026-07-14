namespace Homigo.API.DTOs.Service;

public class UpdateServiceDto
{
    public string Name { get; set; } = null!;

    public decimal BasePrice { get; set; }

    public int CategoryId { get; set; }
}