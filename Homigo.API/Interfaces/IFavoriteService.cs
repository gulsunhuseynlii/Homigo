using Homigo.API.DTOs.Favorite;

namespace Homigo.API.Interfaces;

public interface IFavoriteService
{
    Task AddAsync(int userId, int serviceId);

    Task RemoveAsync(int userId, int serviceId);

    Task<List<FavoriteDto>> GetMyFavoritesAsync(int userId);
}