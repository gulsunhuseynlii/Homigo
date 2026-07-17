namespace Homigo.API.DTOs.Service;

public class ServiceQueryDto
{
    public string? Search { get; set; }

    public int? CategoryId { get; set; }

    public string? Sort { get; set; }

    public int Page { get; set; } = 1;

    public int PageSize { get; set; } = 10;
}