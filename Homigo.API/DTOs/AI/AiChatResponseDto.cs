namespace Homigo.API.DTOs.AI;

public class AiChatResponseDto
{
    public string Message { get; set; } = string.Empty;

    public List<AiServiceRecommendationDto> Recommendations { get; set; } = new();
}

public class AiServiceRecommendationDto
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public decimal BasePrice { get; set; }

    public string? ImageUrl { get; set; }
}