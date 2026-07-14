namespace Homigo.API.DTOs.Service;

public class ServiceDto
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public decimal BasePrice { get; set; }

    public int CategoryId { get; set; }

    public string CategoryName { get; set; } = null!;
}