namespace Homigo.API.DTOs.Address;

public class UpdateAddressDto
{
    public string Title { get; set; } = string.Empty;

    public string City { get; set; } = string.Empty;

    public string District { get; set; } = string.Empty;

    public string Street { get; set; } = string.Empty;

    public string Building { get; set; } = string.Empty;

    public string Apartment { get; set; } = string.Empty;

    public string? Notes { get; set; }

    public bool IsDefault { get; set; }
}