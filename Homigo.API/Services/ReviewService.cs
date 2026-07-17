using Homigo.API.DTOs.Review;
using Homigo.API.Entities;
using Homigo.API.Interfaces;
using Homigo.API.Repositories.Interfaces;

namespace Homigo.API.Services;

public class ReviewService : IReviewService
{
    private readonly IReviewRepository _reviewRepository;

    public ReviewService(IReviewRepository reviewRepository)
    {
        _reviewRepository = reviewRepository;
    }

    public async Task CreateAsync(int customerId, CreateReviewDto dto)
    {
        var order = await _reviewRepository.GetCompletedOrderAsync(dto.OrderId, customerId);

        if (order == null)
            throw new Exception("Completed order not found.");

        var exists = await _reviewRepository.ReviewExistsAsync(dto.OrderId);

        if (exists)
            throw new Exception("Review already exists for this order.");

        var review = new Review
        {
            OrderId = dto.OrderId,
            CustomerId = customerId,
            ProviderId = order.ProviderId!.Value,
            Rating = dto.Rating,
            Comment = dto.Comment,
            CreatedAt = DateTime.UtcNow
        };

        await _reviewRepository.AddAsync(review);
        await _reviewRepository.SaveChangesAsync();
    }

    public async Task<List<ReviewDto>> GetProviderReviewsAsync(int providerId)
    {
        var reviews = await _reviewRepository.GetProviderReviewsAsync(providerId);

        return reviews.Select(x => new ReviewDto
        {
            Id = x.Id,
            CustomerName = x.Customer.FullName,
            Rating = x.Rating,
            Comment = x.Comment,
            CreatedAt = x.CreatedAt
        }).ToList();
    }
}