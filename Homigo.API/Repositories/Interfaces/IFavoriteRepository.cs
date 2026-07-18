using Homigo.API.Entities;

namespace Homigo.API.Repositories.Interfaces;

public interface IFavoriteRepository : IGenericRepository<Favorite>
{
    Task<bool> ExistsAsync(int userId, int serviceId);

    Task<Service?> GetServiceAsync(int serviceId);

    Task<List<Favorite>> GetUserFavoritesAsync(int userId);

    Task<Favorite?> GetFavoriteAsync(int userId, int serviceId);
}