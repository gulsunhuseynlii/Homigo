using Homigo.API.Interfaces;

namespace Homigo.API.Services;

public class FileService : IFileService
{
    private readonly IWebHostEnvironment _environment;

    public FileService(IWebHostEnvironment environment)
    {
        _environment = environment;
    }

    public async Task<string> UploadAsync(
        IFormFile file,
        string folder,
        params string[] allowedExtensions)
    {
        if (file == null || file.Length == 0)
            throw new Exception("File is empty.");

        const long maxFileSize = 10 * 1024 * 1024; // 10 MB

        if (file.Length > maxFileSize)
            throw new Exception("Maximum file size is 10 MB.");

        var extension = Path.GetExtension(file.FileName)
            .ToLowerInvariant();

        if (allowedExtensions.Any() &&
            !allowedExtensions.Contains(extension))
        {
            throw new Exception("Invalid file type.");
        }

        var webRoot = _environment.WebRootPath;

        if (string.IsNullOrWhiteSpace(webRoot))
        {
            webRoot = Path.Combine(
                Directory.GetCurrentDirectory(),
                "wwwroot");
        }

        var uploadsFolder = Path.Combine(
            webRoot,
            "uploads",
            folder);

        if (!Directory.Exists(uploadsFolder))
        {
            Directory.CreateDirectory(uploadsFolder);
        }

        var fileName =
            $"{Guid.NewGuid()}{extension}";

        var filePath = Path.Combine(
            uploadsFolder,
            fileName);

        await using var stream = new FileStream(
            filePath,
            FileMode.Create);

        await file.CopyToAsync(stream);

        return $"/uploads/{folder}/{fileName}";
    }
}