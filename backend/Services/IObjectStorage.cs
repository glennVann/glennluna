namespace GlennLuna.Api.Services;

public interface IObjectStorage
{
    bool IsEnabled { get; }

    Task<string?> SaveAsync(
        string prefix,
        byte[] bytes,
        string fileName,
        string contentType,
        CancellationToken cancellationToken = default);

    Task<byte[]?> GetAsync(string? objectKey, CancellationToken cancellationToken = default);

    Task DeleteAsync(string? objectKey, CancellationToken cancellationToken = default);
}
