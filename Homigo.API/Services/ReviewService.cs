using Homigo.API.DTOs.Review;
using Homigo.API.Entities;
using Homigo.API.Exceptions;
using Homigo.API.Interfaces;
using Homigo.API.Repositories.Interfaces;
using Microsoft.Extensions.Logging;

namespace Homigo.API.Services;

public class ReviewService : IReviewService
{
    private readonly IReviewRepository _reviewRepository;
    private readonly ILogger<ReviewService> _logger;

    public ReviewService(
        IReviewRepository reviewRepository,
        ILogger<ReviewService> logger)
    {
        _reviewRepository = reviewRepository;
        _logger = logger;
    }

    public async Task CreateAsync(int customerId, CreateReviewDto dto)
    {
        _logger.LogInformation(
            "Customer {CustomerId} is creating a review for order {OrderId}.",
            customerId,
            dto.OrderId);

        var order = await _reviewRepository.GetCompletedOrderAsync(dto.OrderId, customerId);

        if (order == null)
        {
            _logger.LogWarning(
                "Completed order {OrderId} not found for customer {CustomerId}.",
                dto.OrderId,
                customerId);

            throw new NotFoundException("Completed order not found.");
        }

        var paymentExists = await _reviewRepository.PaymentExistsAsync(dto.OrderId);

        if (!paymentExists)
        {
            _logger.LogWarning(
                "Review creation failed. Payment not found for order {OrderId}.",
                dto.OrderId);

            throw new BadRequestException("Payment must be completed before adding a review.");
        }

        var exists = await _reviewRepository.ReviewExistsAsync(dto.OrderId);

        if (exists)
        {
            _logger.LogWarning(
                "Review already exists for order {OrderId}.",
                dto.OrderId);

            throw new BadRequestException("Review already exists for this order.");
        }

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

        _logger.LogInformation(
            "Review {ReviewId} created successfully for order {OrderId}.",
            review.Id,
            review.OrderId);
    }

    public async Task<List<ReviewDto>> GetProviderReviewsAsync(int providerId)
    {
        _logger.LogInformation(
            "Provider {ProviderId} requested reviews.",
            providerId);

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