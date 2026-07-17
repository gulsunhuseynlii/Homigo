using Homigo.API.DTOs.Dashboard;
using Homigo.API.Interfaces;
using Homigo.API.Repositories.Interfaces;

namespace Homigo.API.Services;

public class DashboardService : IDashboardService
{
    private readonly IDashboardRepository _dashboardRepository;

    public DashboardService(IDashboardRepository dashboardRepository)
    {
        _dashboardRepository = dashboardRepository;
    }

    public async Task<AdminDashboardDto> GetAdminDashboardAsync()
    {
        return await _dashboardRepository.GetAdminDashboardAsync();
    }
}