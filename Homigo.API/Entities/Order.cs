using Homigo.API.Enums;

namespace Homigo.API.Entities;

public class Order : BaseEntity
{
    public int CustomerId { get; set; }

    public User Customer { get; set; } = null!;

    public int? ProviderId { get; set; }

    public User? Provider { get; set; }

    public int ServiceId { get; set; }

    public Service Service { get; set; } = null!;

    public int AddressId { get; set; }

    public Address Address { get; set; } = null!;

    public DateTime ScheduledDate { get; set; }

    public decimal TotalPrice { get; set; }

    public OrderStatus Status { get; set; }
}