namespace Homigo.API.DTOs.Category;

public class CreateCategoryDto
{
    public string Name { get; set; } = string.Empty;

    public string? Icon { get; set; }
}