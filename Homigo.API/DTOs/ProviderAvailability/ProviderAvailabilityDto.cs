namespace Homigo.API.DTOs.ProviderAvailability;

public class ProviderAvailabilityDto
{
    public DayOfWeek DayOfWeek { get; set; }

    public TimeSpan StartTime { get; set; }

    public TimeSpan EndTime { get; set; }
}