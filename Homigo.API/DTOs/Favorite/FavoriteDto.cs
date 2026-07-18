namespace Homigo.API.DTOs.Favorite;

public class FavoriteDto
{
    public int Id { get; set; }

    public int ServiceId { get; set; }

    public string ServiceName { get; set; } = string.Empty;

    public decimal BasePrice { get; set; }

    public string CategoryName { get; set; } = string.Empty;
}