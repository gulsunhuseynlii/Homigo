using FluentValidation;
using Homigo.API.DTOs.Service;

namespace Homigo.API.Validators;

public class CreateServiceDtoValidator : AbstractValidator<CreateServiceDto>
{
    public CreateServiceDtoValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty()
            .MaximumLength(100);

        RuleFor(x => x.Description)
            .NotEmpty();

        RuleFor(x => x.BasePrice)
            .GreaterThan(0);

        RuleFor(x => x.EstimatedMinutes)
            .GreaterThan(0);
    
    }
}