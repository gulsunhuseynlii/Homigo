using Homigo.API.DTOs.Dashboard;

namespace Homigo.API.Repositories.Interfaces;

public interface IDashboardRepository
{
    Task<AdminDashboardDto> GetAdminDashboardAsync();
}