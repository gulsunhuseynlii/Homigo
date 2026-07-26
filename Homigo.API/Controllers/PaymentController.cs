using Homigo.API.DTOs.Payment;
using Homigo.API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Homigo.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Customer")]
public class PaymentController : ControllerBase
{
    private readonly IPaymentService _paymentService;

    public PaymentController(IPaymentService paymentService)
    {
        _paymentService = paymentService;
    }

    [HttpPost("checkout/{orderId}")]
    public async Task<IActionResult> CreateCheckoutSession(int orderId)
    {
        var customerId =
            int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var result =
            await _paymentService.CreateCheckoutSessionAsync(
                customerId,
                orderId);

        return Ok(result);
    }

    [HttpGet("my-payments")]
    public async Task<IActionResult> GetMyPayments()
    {
        var customerId =
            int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var result =
            await _paymentService.GetMyPaymentsAsync(customerId);

        return Ok(result);
    }
   
}