using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using Homigo.API.DTOs.AI;
using Homigo.API.DTOs.Service;
using Homigo.API.Interfaces;
using Homigo.API.Repositories.Interfaces;
using Homigo.API.Settings;
using Microsoft.Extensions.Options;

namespace Homigo.API.Services;

public class AiService : IAiService
{
    private readonly IServiceRepository _serviceRepository;
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly GeminiSettings _settings;

    public AiService(
        IServiceRepository serviceRepository,
        IHttpClientFactory httpClientFactory,
        IOptions<GeminiSettings> settings)
    {
        _serviceRepository = serviceRepository;
        _httpClientFactory = httpClientFactory;
        _settings = settings.Value;
    }

    public async Task<AiChatResponseDto> ChatAsync(string message)
    {
        if (string.IsNullOrWhiteSpace(message))
        {
            throw new ArgumentException(
                "Message cannot be empty.");
        }

        // Get real Homigo services
        var query = new ServiceQueryDto
        {
            Page = 1,
            PageSize = 100
        };

        var (services, _) =
            await _serviceRepository.GetAllAsync(query);

        var serviceData = services.Select(x => new
        {
            x.Id,
            x.Name,
            x.Description,
            x.BasePrice,
            x.ImageUrl
        });

        var servicesJson =
            JsonSerializer.Serialize(serviceData);

        var prompt = """
You are Homigo AI Assistant.

Homigo is a home services marketplace.

Your job is to understand the customer's problem
and recommend the most relevant services available
in Homigo.

IMPORTANT RULES:

1. Recommend ONLY services from the provided list.
2. Never invent a service.
3. Never invent a price.
4. Never invent a provider.
5. If no service is suitable, clearly say so.
6. Keep the answer short and helpful.
7. Respond in the same language as the user.
8. Return ONLY valid JSON.

Available Homigo services:

""" + servicesJson + """

Customer message:

""" + message + """

Return exactly this JSON structure:

{
  "message": "Your helpful answer",
  "serviceIds": [1, 2]
}
""";

        var client =
            _httpClientFactory.CreateClient();

        var url =
            $"https://generativelanguage.googleapis.com/v1beta/models/{_settings.Model}:generateContent";

        using var request =
            new HttpRequestMessage(
                HttpMethod.Post,
                url);

        request.Headers.Add(
            "x-goog-api-key",
            _settings.ApiKey);

        var requestBody = new
        {
            contents = new[]
            {
                new
                {
                    parts = new[]
                    {
                        new
                        {
                            text = prompt
                        }
                    }
                }
            }
        };

        var json =
            JsonSerializer.Serialize(requestBody);

        request.Content =
            new StringContent(
                json,
                Encoding.UTF8,
                "application/json");

        var response =
            await client.SendAsync(request);

        var responseContent =
            await response.Content.ReadAsStringAsync();

        if (!response.IsSuccessStatusCode)
        {
            throw new Exception(
                $"Gemini request failed: {responseContent}");
        }

        using var document =
            JsonDocument.Parse(responseContent);

        var outputText =
            ExtractGeminiText(document);

        if (string.IsNullOrWhiteSpace(outputText))
        {
            throw new Exception(
                "Gemini returned an empty response.");
        }

        // Gemini bəzən JSON-u ```json ... ```
        // içində qaytara bilər.
        outputText =
            CleanJsonResponse(outputText);

        var aiResult =
            JsonSerializer.Deserialize<AiResult>(
                outputText,
                new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });

        if (aiResult == null)
        {
            throw new Exception(
                "Invalid Gemini response.");
        }

        var recommendations =
            services
                .Where(x =>
                    aiResult.ServiceIds.Contains(x.Id))
                .Select(x =>
                    new AiServiceRecommendationDto
                    {
                        Id = x.Id,
                        Name = x.Name,
                        Description = x.Description,
                        BasePrice = x.BasePrice,
                        ImageUrl = x.ImageUrl
                    })
                .ToList();

        return new AiChatResponseDto
        {
            Message = aiResult.Message,
            Recommendations = recommendations
        };
    }

    private static string? ExtractGeminiText(
        JsonDocument document)
    {
        if (!document.RootElement.TryGetProperty(
                "candidates",
                out var candidates))
        {
            return null;
        }

        if (candidates.GetArrayLength() == 0)
        {
            return null;
        }

        var candidate =
            candidates[0];

        if (!candidate.TryGetProperty(
                "content",
                out var content))
        {
            return null;
        }

        if (!content.TryGetProperty(
                "parts",
                out var parts))
        {
            return null;
        }

        foreach (var part in parts.EnumerateArray())
        {
            if (part.TryGetProperty(
                    "text",
                    out var text))
            {
                return text.GetString();
            }
        }

        return null;
    }

    private static string CleanJsonResponse(
        string text)
    {
        text = text.Trim();

        if (text.StartsWith("```json"))
        {
            text = text
                .Replace("```json", "")
                .Replace("```", "")
                .Trim();
        }
        else if (text.StartsWith("```"))
        {
            text = text
                .Replace("```", "")
                .Trim();
        }

        return text;
    }

    private class AiResult
    {
        public string Message { get; set; } = string.Empty;

        public List<int> ServiceIds { get; set; } = new();
    }
}