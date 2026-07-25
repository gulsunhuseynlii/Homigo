namespace Homigo.API.DTOs.Payment;

public class CreatePaymentDto
{

    public string PaymentMethod { get; set; } = string.Empty;

    public string CardNumber { get; set; } = string.Empty;

    public string CardHolder { get; set; } = string.Empty;

    public string Expiry { get; set; } = string.Empty;

    public string Cvv { get; set; } = string.Empty;
}