using Homigo.API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Homigo.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Customer")]
public class FavoriteController : ControllerBase
{
    private readonly IFavoriteService _favoriteService;

    public FavoriteController(IFavoriteService favoriteService)
    {
        _favoriteService = favoriteService;
    }

    [HttpPost("{serviceId}")]
    public async Task<IActionResult> Add(int serviceId)
    {
        var userId =
            int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        await _favoriteService.AddAsync(userId, serviceId);

        return Ok(new
        {
            message = "Service added to favorites."
        });
    }

    [HttpDelete("{serviceId}")]
    public async Task<IActionResult> Remove(int serviceId)
    {
        var userId =
            int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        await _favoriteService.RemoveAsync(userId, serviceId);

        return Ok(new
        {
            message = "Service removed from favorites."
        });
    }

    [HttpGet]
    public async Task<IActionResult> GetMyFavorites()
    {
        var userId =
            int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var result = await _favoriteService.GetMyFavoritesAsync(userId);

        return Ok(result);
    }
}