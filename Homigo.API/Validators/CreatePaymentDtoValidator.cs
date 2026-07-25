using FluentValidation;
using Homigo.API.DTOs.Payment;

namespace Homigo.API.Validators;

public class CreatePaymentDtoValidator : AbstractValidator<CreatePaymentDto>
{
    public CreatePaymentDtoValidator()
    {

        RuleFor(x => x.PaymentMethod)
            .NotEmpty();

        RuleFor(x => x.CardNumber)
            .NotEmpty();

        RuleFor(x => x.CardHolder)
            .NotEmpty();

        RuleFor(x => x.Expiry)
            .NotEmpty();

        RuleFor(x => x.Cvv)
            .NotEmpty();
    }
}