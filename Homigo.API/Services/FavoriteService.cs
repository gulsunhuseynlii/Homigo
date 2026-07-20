using Homigo.API.DTOs.Favorite;
using Homigo.API.Entities;
using Homigo.API.Exceptions;
using Homigo.API.Interfaces;
using Homigo.API.Repositories.Interfaces;
using Microsoft.Extensions.Logging;

namespace Homigo.API.Services;

public class FavoriteService : IFavoriteService
{
    private readonly IFavoriteRepository _favoriteRepository;
    private readonly ILogger<FavoriteService> _logger;

    public FavoriteService(
        IFavoriteRepository favoriteRepository,
        ILogger<FavoriteService> logger)
    {
        _favoriteRepository = favoriteRepository;
        _logger = logger;
    }

    public async Task AddAsync(int userId, int serviceId)
    {
        _logger.LogInformation(
            "User {UserId} is adding service {ServiceId} to favorites.",
            userId,
            serviceId);

        var service = await _favoriteRepository.GetServiceAsync(serviceId);

        if (service == null)
        {
            _logger.LogWarning(
                "Service {ServiceId} not found.",
                serviceId);

            throw new NotFoundException("Service not found.");
        }

        var exists = await _favoriteRepository.ExistsAsync(userId, serviceId);

        if (exists)
        {
            _logger.LogWarning(
                "Service {ServiceId} is already in favorites for user {UserId}.",
                serviceId,
                userId);

            throw new BadRequestException("Service already exists in favorites.");
        }

        var favorite = new Favorite
        {
            UserId = userId,
            ServiceId = serviceId
        };

        await _favoriteRepository.AddAsync(favorite);
        await _favoriteRepository.SaveChangesAsync();

        _logger.LogInformation(
            "Favorite {FavoriteId} created successfully.",
            favorite.Id);
    }

    public async Task RemoveAsync(int userId, int serviceId)
    {
        _logger.LogInformation(
            "User {UserId} is removing service {ServiceId} from favorites.",
            userId,
            serviceId);

        var favorite = await _favoriteRepository.GetFavoriteAsync(userId, serviceId);

        if (favorite == null)
        {
            _logger.LogWarning(
                "Favorite not found. User {UserId}, Service {ServiceId}.",
                userId,
                serviceId);

            throw new NotFoundException("Favorite not found.");
        }

        await _favoriteRepository.DeleteAsync(favorite);
        await _favoriteRepository.SaveChangesAsync();

        _logger.LogInformation(
            "Favorite removed successfully. User {UserId}, Service {ServiceId}.",
            userId,
            serviceId);
    }

    public async Task<List<FavoriteDto>> GetMyFavoritesAsync(int userId)
    {
        _logger.LogInformation(
            "User {UserId} requested favorite services.",
            userId);

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