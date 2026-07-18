namespace Homigo.API.Entities;

public class EmailVerificationToken
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public User User { get; set; } = null!;

    public string Token { get; set; } = Guid.NewGuid().ToString();

    public DateTime ExpireDate { get; set; }

    public bool IsUsed { get; set; }
}