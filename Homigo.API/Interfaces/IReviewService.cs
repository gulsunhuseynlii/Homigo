using Homigo.API.DTOs.Review;

namespace Homigo.API.Interfaces;

public interface IReviewService
{
    Task CreateAsync(int customerId, CreateReviewDto dto);

    Task<List<ReviewDto>> GetProviderReviewsAsync(int providerId);
}