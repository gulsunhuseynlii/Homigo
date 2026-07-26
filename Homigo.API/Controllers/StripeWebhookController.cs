using Homigo.API.Entities;
using Homigo.API.Enums;
using Homigo.API.Repositories.Interfaces;
using Homigo.API.Settings;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Stripe;
using Stripe.Checkout;

namespace Homigo.API.Controllers;

[ApiController]
[Route("api/stripe")]
public class StripeWebhookController : ControllerBase
{
    private readonly StripeSettings _stripeSettings;
    private readonly IPaymentRepository _paymentRepository;
    private readonly IOrderRepository _orderRepository;
    public StripeWebhookController(
     IOptions<StripeSettings> stripeOptions,
     IPaymentRepository paymentRepository,
     IOrderRepository orderRepository)
    {
        _stripeSettings = stripeOptions.Value;
        _paymentRepository = paymentRepository;
        _orderRepository = orderRepository;
    }

    [HttpPost("webhook")]
    public async Task<IActionResult> Webhook()
    {
        var json = await new StreamReader(HttpContext.Request.Body)
            .ReadToEndAsync();

        Event stripeEvent;

        try
        {
            stripeEvent = EventUtility.ConstructEvent(
                json,
                Request.Headers["Stripe-Signature"],
                _stripeSettings.WebhookSecret);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }

        if (stripeEvent.Type == "checkout.session.completed")
        {
            var session = stripeEvent.Data.Object as Session;

            if (session != null)
            {
                var orderId =
                    int.Parse(session.Metadata["orderId"]);

                var paymentExists =
                    await _paymentRepository.PaymentExistsAsync(orderId);

                if (!paymentExists)
                {
                    var order =
                        await _paymentRepository.GetOrderByIdAsync(orderId);

                    if (order != null)
                    {
                        var payment = new Payment
                        {
                            OrderId = order.Id,
                            Amount = order.TotalPrice,
                            PaymentMethod = "Stripe",
                            Status = PaymentStatus.Paid,
                            TransactionId =
                                session.PaymentIntentId ?? session.Id,
                            CreatedAt = DateTime.UtcNow
                        };

                        order.PaymentStatus = PaymentStatus.Paid;

                        await _paymentRepository.AddAsync(payment);

                        await _orderRepository.UpdateAsync(order);

                        await _paymentRepository.SaveChangesAsync();
                    }
                }
            }
        }

        return Ok();
    }
}