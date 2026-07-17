namespace Homigo.API.DTOs.Dashboard;

public class AdminDashboardDto
{
    public int TotalUsers { get; set; }

    public int TotalProviders { get; set; }

    public int PendingProviders { get; set; }

    public int TotalOrders { get; set; }

    public int PendingOrders { get; set; }

    public int CompletedOrders { get; set; }

    public decimal TotalRevenue { get; set; }

    public int TotalReviews { get; set; }
}