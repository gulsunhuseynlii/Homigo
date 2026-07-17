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

    [HttpPost("pay")]
    public async Task<IActionResult> Pay(CreatePaymentDto dto)
    {
        var customerId =
            int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var result = await _paymentService.PayAsync(customerId, dto);

        return Ok(result);
    }

    [HttpGet("my-payments")]
    public async Task<IActionResult> GetMyPayments()
    {
        var customerId =
            int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var result = await _paymentService.GetMyPaymentsAsync(customerId);

        return Ok(result);
    }
}