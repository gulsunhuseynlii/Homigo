namespace Homigo.API.DTOs.Auth
{
    public class UpdateProfileDto
    {
        public string FullName { get; set; } = string.Empty;

        public string PhoneNumber { get; set; } = string.Empty;

        public IFormFile? ProfileImage { get; set; }
        public string Email { get; set; } = string.Empty;

    }
}
