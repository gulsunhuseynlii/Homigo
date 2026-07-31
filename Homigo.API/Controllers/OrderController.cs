using Homigo.API.DTOs.Order;
using Homigo.API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Homigo.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class OrderController : ControllerBase
{
    private readonly IOrderService _orderService;

    public OrderController(IOrderService orderService)
    {
        _orderService = orderService;
    }
    [Authorize(Roles = "Customer")]
    [HttpPost]
    public async Task<IActionResult> Create(CreateOrderDto dto)
    {
        var userId =
            int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var orderId =
            await _orderService.CreateAsync(userId, dto);

        return Ok(new
        {
            orderId,
            message = "Order created successfully."
        });
    }
    [Authorize(Roles = "Customer")]
    [HttpGet("my-orders")]
    public async Task<IActionResult> GetMyOrders(
    [FromQuery] OrderQueryDto query)
    {
        var userId =
            int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var result =
            await _orderService.GetMyOrdersAsync(userId, query);

        return Ok(result);
    }

    [Authorize(Roles = "Provider")]
    [HttpGet("my-provider-orders")]
    public async Task<IActionResult> GetMyProviderOrders(
    [FromQuery] OrderQueryDto query)
    {
        var providerUserId =
            int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var result =
            await _orderService.GetMyProviderOrdersAsync(
                providerUserId,
                query);

        return Ok(result);
    }

    [Authorize(Roles = "Provider")]
    [HttpPut("start/{id}")]
    public async Task<IActionResult> Start(int id)
    {
        var providerUserId =
            int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        await _orderService.StartOrderAsync(id, providerUserId);

        return Ok(new
        {
            message = "Order started successfully."
        });
    }
    [Authorize(Roles = "Provider")]
    [HttpPut("complete/{id}")]
    public async Task<IActionResult> Complete(int id)
    {
        var providerUserId =
            int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        await _orderService.CompleteOrderAsync(id, providerUserId);

        return Ok(new
        {
            message = "Order completed successfully."
        });
    }
    [Authorize(Roles = "Provider")]
    [HttpPut("accept/{id}")]
    public async Task<IActionResult> Accept(int id)
    {
        var providerUserId =
            int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        await _orderService.AcceptOrderAsync(id, providerUserId);

        return Ok(new
        {
            message = "Order accepted successfully."
        });
    }
    [Authorize(Roles = "Customer")]
    [HttpPut("cancel/{id}")]
    public async Task<IActionResult> Cancel(int id)
    {
        var customerId =
            int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        await _orderService.CancelOrderAsync(id, customerId);

        return Ok(new
        {
            message = "Order cancelled successfully."
        });
    }
    [Authorize(Roles = "Provider")]
    [HttpPut("reject/{id}")]
    public async Task<IActionResult> Reject(int id)
    {
        var providerUserId =
            int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        await _orderService.RejectOrderAsync(id, providerUserId);

        return Ok(new
        {
            message = "Order rejected successfully."
        });
    }
}