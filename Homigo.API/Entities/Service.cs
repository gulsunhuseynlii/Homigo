namespace Homigo.API.Entities;

public class Service : BaseEntity
{
    public string Name { get; set; } = string.Empty;

    public string? Description { get; set; }

    public decimal BasePrice { get; set; }

    public int CategoryId { get; set; }

    public Category Category { get; set; } = null!;
}