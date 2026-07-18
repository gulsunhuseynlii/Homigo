using Homigo.API.DTOs.Favorite;
using Homigo.API.Entities;
using Homigo.API.Interfaces;
using Homigo.API.Repositories.Interfaces;

namespace Homigo.API.Services;

public class FavoriteService : IFavoriteService
{
    private readonly IFavoriteRepository _favoriteRepository;

    public FavoriteService(IFavoriteRepository favoriteRepository)
    {
        _favoriteRepository = favoriteRepository;
    }

    public async Task AddAsync(int userId, int serviceId)
    {
        var service = await _favoriteRepository.GetServiceAsync(serviceId);

        if (service == null)
            throw new Exception("Service not found.");

        var exists = await _favoriteRepository.ExistsAsync(userId, serviceId);

        if (exists)
            throw new Exception("Service already exists in favorites.");

        var favorite = new Favorite
        {
            UserId = userId,
            ServiceId = serviceId
        };

        await _favoriteRepository.AddAsync(favorite);
        await _favoriteRepository.SaveChangesAsync();
    }

    public async Task RemoveAsync(int userId, int serviceId)
    {
        var favorite = await _favoriteRepository.GetFavoriteAsync(userId, serviceId);

        if (favorite == null)
            throw new Exception("Favorite not found.");

        await _favoriteRepository.DeleteAsync(favorite);
        await _favoriteRepository.SaveChangesAsync();
    }

    public async Task<List<FavoriteDto>> GetMyFavoritesAsync(int userId)
    {
        var favorites = await _favoriteRepository.GetUserFavoritesAsync(userId);

        return favorites.Select(x => new FavoriteDto
        {
            Id = x.Id,
            ServiceId = x.ServiceId,
            ServiceName = x.Service.Name,
            BasePrice = x.Service.BasePrice,
            CategoryName = x.Service.Category.Name
        }).ToList();
    }
}