using Homigo.API.DTOs.AI;
using Homigo.API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Homigo.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[AllowAnonymous]
public class AiController : ControllerBase
{
    private readonly IAiService _aiService;

    public AiController(IAiService aiService)
    {
        _aiService = aiService;
    }

    [HttpPost("chat")]
    public async Task<IActionResult> Chat(
        [FromBody] AiChatRequestDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Message))
        {
            return BadRequest(new
            {
                message = "Please enter a message."
            });
        }

        try
        {
            var result =
                await _aiService.ChatAsync(dto.Message);

            return Ok(result);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                message = "AI assistant is currently unavailable.",
                error = ex.Message
            });
        }
    }
}