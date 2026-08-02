using Homigo.API.DTOs.Address;

namespace Homigo.API.DTOs.Order;

public class OrderDto
{
    public int Id { get; set; }

    public string ServiceName { get; set; } = string.Empty;

    public AddressDto Address { get; set; } = null!;

    public decimal TotalPrice { get; set; }

    public DateTime ScheduledDate { get; set; }

    public string Status { get; set; } = string.Empty;
    public string PaymentStatus { get; set; } = string.Empty;
    public string? ProviderName { get; set; }
    public string CustomerName { get; set; } = string.Empty;
}