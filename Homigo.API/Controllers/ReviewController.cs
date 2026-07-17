using Homigo.API.DTOs.Review;
using Homigo.API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Homigo.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ReviewController : ControllerBase
{
    private readonly IReviewService _reviewService;

    public ReviewController(IReviewService reviewService)
    {
        _reviewService = reviewService;
    }

    [Authorize(Roles = "Customer")]
    [HttpPost]
    public async Task<IActionResult> Create(CreateReviewDto dto)
    {
        var customerId =
            int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        await _reviewService.CreateAsync(customerId, dto);

        return Ok(new
        {
            message = "Review added successfully."
        });
    }

    [HttpGet("provider/{providerId}")]
    public async Task<IActionResult> GetProviderReviews(int providerId)
    {
        var result = await _reviewService.GetProviderReviewsAsync(providerId);

        return Ok(result);
    }
}