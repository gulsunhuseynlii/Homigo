namespace Homigo.API.Entities;

public class Category : BaseEntity
{
    public string Name { get; set; } = string.Empty;

    public string? Icon { get; set; }

    public ICollection<Service> Services { get; set; } = new List<Service>();
}