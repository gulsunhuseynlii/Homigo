using FluentValidation;
using Homigo.API.DTOs.Payment;

namespace Homigo.API.Validators;

public class CreatePaymentDtoValidator : AbstractValidator<CreatePaymentDto>
{
    public CreatePaymentDtoValidator()
    {
        RuleFor(x => x.OrderId)
            .GreaterThan(0);

        RuleFor(x => x.PaymentMethod)
            .NotEmpty();
    }
}