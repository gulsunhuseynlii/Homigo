namespace Homigo.API.Entities;

public class ProviderAvailability : BaseEntity
{
    public int ProviderId { get; set; }

    public ProviderProfile Provider { get; set; } = null!;

    public DayOfWeek DayOfWeek { get; set; }

    public TimeSpan StartTime { get; set; }

    public TimeSpan EndTime { get; set; }
}