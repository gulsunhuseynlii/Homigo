namespace Homigo.API.DTOs.ProviderAvailability;

public class UpdateProviderAvailabilityDto
{
    public List<ProviderAvailabilityDto> Availabilities { get; set; }
        = new();
}