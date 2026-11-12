using Homigo.API.DTOs.AI;

namespace Homigo.API.Interfaces;

public interface IAiService
{
    Task<AiChatResponseDto> ChatAsync(string message);
}