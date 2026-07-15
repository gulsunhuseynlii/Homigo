namespace Homigo.API.DTOs.Order;

public class CreateOrderDto
{
    public int ServiceId { get; set; }

    public int AddressId { get; set; }

    public DateTime ScheduledDate { get; set; }
}