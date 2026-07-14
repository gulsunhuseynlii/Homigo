using FluentValidation;
using Homigo.API.DTOs.Category;

namespace Homigo.API.Validators;

public class CreateCategoryValidator : AbstractValidator<CreateCategoryDto>
{
    public CreateCategoryValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty()
            .WithMessage("Category name is required.")
            .MaximumLength(100)
            .WithMessage("Category name cannot exceed 100 characters.");

        RuleFor(x => x.Icon)
            .MaximumLength(255)
            .When(x => !string.IsNullOrWhiteSpace(x.Icon));
    }
}