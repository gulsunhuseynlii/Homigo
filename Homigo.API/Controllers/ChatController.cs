using Homigo.API.DTOs.Chat;
using Homigo.API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Homigo.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ChatController : ControllerBase
{
    private readonly IChatService _chatService;

    public ChatController(IChatService chatService)
    {
        _chatService = chatService;
    }

    [HttpGet("{orderId}")]
    public async Task<IActionResult> GetMessages(int orderId)
    {
        var userId = int.Parse(
            User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var result = await _chatService.GetMessagesAsync(
            orderId,
            userId);

        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> SendMessage(
        SendMessageDto dto)
    {
        var userId = int.Parse(
            User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        await _chatService.SendMessageAsync(userId, dto);

        return Ok(new
        {
            message = "Message sent successfully."
        });
    }
}