using Homigo.API.Enums;

namespace Homigo.API.DTOs.Payment;

public class PaymentDto
{
    public int Id { get; set; }

    public int OrderId { get; set; }

    public string ServiceName { get; set; } = string.Empty;

    public decimal Amount { get; set; }

    public string PaymentMethod { get; set; } = string.Empty;

    public string Status { get; set; } = string.Empty;

    public string TransactionId { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; }
}