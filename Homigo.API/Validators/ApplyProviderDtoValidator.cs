using FluentValidation;
using Homigo.API.DTOs.Provider;

namespace Homigo.API.Validators;

public class ApplyProviderDtoValidator : AbstractValidator<ApplyProviderDto>
{
    public ApplyProviderDtoValidator()
    {
        RuleFor(x => x.PhoneNumber)
            .NotEmpty()
            .MaximumLength(20);

        RuleFor(x => x.Bio)
            .NotEmpty()
            .MaximumLength(500);

        RuleFor(x => x.YearsOfExperience)
            .GreaterThanOrEqualTo(0);

        RuleFor(x => x.CategoryId)
            .GreaterThan(0);

        RuleFor(x => x.ProfileImage)
            .NotNull();

        RuleFor(x => x.IdentityCard)
            .NotNull();

        RuleFor(x => x.Cv)
            .NotNull();
    }
}