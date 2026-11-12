using Microsoft.AspNetCore.Http;

namespace Homigo.API.DTOs.Chat;

public class SendMessageDto
{
    public int OrderId { get; set; }

    public string? Message { get; set; }

    public IFormFile? File { get; set; }
}