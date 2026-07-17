using Homigo.API.DTOs.Dashboard;

namespace Homigo.API.Interfaces;

public interface IDashboardService
{
    Task<AdminDashboardDto> GetAdminDashboardAsync();
}