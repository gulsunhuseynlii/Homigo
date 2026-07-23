using FluentValidation;
using Homigo.API.DTOs.Provider;

namespace Homigo.API.Validators;

public class ApplyProviderDtoValidator : AbstractValidator<ApplyProviderDto>
{
    public ApplyProviderDtoValidator()
    {
        RuleFor(x => x.PhoneNumber)
              .NotEmpty();

        RuleFor(x => x.CategoryId)
            .GreaterThan(0);

        RuleFor(x => x.Bio)
            .NotEmpty()
            .MaximumLength(100);

        RuleFor(x => x.YearsOfExperience)
            .InclusiveBetween(0, 60);

        RuleFor(x => x.ProfileImage)
            .NotNull();

        RuleFor(x => x.IdentityCard)
            .NotNull();

        RuleFor(x => x.Cv)
            .NotNull();
    }
}