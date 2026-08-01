namespace Homigo.API.DTOs.Provider;

public class ProviderQueryDto
{
    public int? ServiceId { get; set; }

    public string? Search { get; set; }

    public string? Sort { get; set; }

    public int Page { get; set; } = 1;

    public int PageSize { get; set; } = 9;
}