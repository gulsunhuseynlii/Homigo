namespace Homigo.API.DTOs.Order;

public class OrderDto
{
    public int Id { get; set; }

    public string ServiceName { get; set; } = string.Empty;

    public string AddressTitle { get; set; } = string.Empty;

    public decimal TotalPrice { get; set; }

    public DateTime ScheduledDate { get; set; }

    public string Status { get; set; } = string.Empty;

    public string? ProviderName { get; set; }
    public string CustomerName { get; set; } = string.Empty;
}