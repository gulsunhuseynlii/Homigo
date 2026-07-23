using Microsoft.AspNetCore.Http;

namespace Homigo.API.DTOs.Provider;

public class ApplyProviderDto
{
    public int CategoryId { get; set; }

    public string PhoneNumber { get; set; } = string.Empty;

    public string Bio { get; set; } = string.Empty;

    public int YearsOfExperience { get; set; }

    public IFormFile ProfileImage { get; set; } = null!;

    public IFormFile IdentityCard { get; set; } = null!;

    public IFormFile Cv { get; set; } = null!;

    public IFormFile? Certificate { get; set; }
}