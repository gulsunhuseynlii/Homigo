namespace Homigo.API.DTOs.Auth
{

    public class ProfileDto
    {
        public int Id { get; set; }

        public string FullName { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public string PhoneNumber { get; set; } = string.Empty;

        public string? ProfileImageUrl { get; set; }

        public string Role { get; set; } = string.Empty;
    }
}
