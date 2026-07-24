using Microsoft.AspNetCore.Http;

namespace Homigo.API.Interfaces;

public interface IFileService
{
    Task<string> UploadAsync(
        IFormFile file,
        string folder,
        params string[] allowedExtensions);

    void Delete(string filePath);
}