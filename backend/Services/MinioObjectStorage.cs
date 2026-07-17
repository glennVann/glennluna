using Minio;
using Minio.DataModel.Args;

namespace GlennLuna.Api.Services;

public sealed class MinioObjectStorage : IObjectStorage
{
    private readonly IMinioClient? client;
    private readonly string bucketName;
    private readonly SemaphoreSlim bucketLock = new(1, 1);
    private bool bucketReady;

    public MinioObjectStorage(IConfiguration configuration)
    {
        var endpoint = configuration["MINIO_ENDPOINT"] ?? configuration["Minio:Endpoint"];
        var accessKey = configuration["MINIO_ACCESS_KEY"] ?? configuration["Minio:AccessKey"];
        var secretKey = configuration["MINIO_SECRET_KEY"] ?? configuration["Minio:SecretKey"];
        bucketName = configuration["MINIO_BUCKET"] ?? configuration["Minio:Bucket"] ?? "glennluna";
        var useSsl = bool.TryParse(configuration["MINIO_USE_SSL"] ?? configuration["Minio:UseSsl"], out var configuredUseSsl)
            ? configuredUseSsl
            : endpoint?.StartsWith("https://", StringComparison.OrdinalIgnoreCase) == true;

        if (string.IsNullOrWhiteSpace(endpoint) ||
            string.IsNullOrWhiteSpace(accessKey) ||
            string.IsNullOrWhiteSpace(secretKey))
        {
            return;
        }

        client = new MinioClient()
            .WithEndpoint(NormalizeEndpoint(endpoint))
            .WithCredentials(accessKey, secretKey)
            .WithSSL(useSsl)
            .Build();
    }

    public bool IsEnabled => client is not null;

    public async Task<string?> SaveAsync(
        string prefix,
        byte[] bytes,
        string fileName,
        string contentType,
        CancellationToken cancellationToken = default)
    {
        if (client is null) return null;

        await EnsureBucketAsync(cancellationToken);
        var objectKey = BuildObjectKey(prefix, fileName);
        await using var stream = new MemoryStream(bytes);

        await client.PutObjectAsync(
            new PutObjectArgs()
                .WithBucket(bucketName)
                .WithObject(objectKey)
                .WithStreamData(stream)
                .WithObjectSize(bytes.Length)
                .WithContentType(contentType),
            cancellationToken);

        return objectKey;
    }

    public async Task<byte[]?> GetAsync(string? objectKey, CancellationToken cancellationToken = default)
    {
        if (client is null || string.IsNullOrWhiteSpace(objectKey)) return null;

        try
        {
            await using var stream = new MemoryStream();
            await client.GetObjectAsync(
                new GetObjectArgs()
                    .WithBucket(bucketName)
                    .WithObject(objectKey)
                    .WithCallbackStream(source => source.CopyTo(stream)),
                cancellationToken);

            return stream.ToArray();
        }
        catch
        {
            return null;
        }
    }

    public async Task DeleteAsync(string? objectKey, CancellationToken cancellationToken = default)
    {
        if (client is null || string.IsNullOrWhiteSpace(objectKey)) return;

        try
        {
            await client.RemoveObjectAsync(
                new RemoveObjectArgs()
                    .WithBucket(bucketName)
                    .WithObject(objectKey),
                cancellationToken);
        }
        catch
        {
            // Delete is best-effort so a missing old object does not block profile or design updates.
        }
    }

    private async Task EnsureBucketAsync(CancellationToken cancellationToken)
    {
        if (client is null || bucketReady) return;

        await bucketLock.WaitAsync(cancellationToken);
        try
        {
            if (bucketReady) return;

            var exists = await client.BucketExistsAsync(
                new BucketExistsArgs().WithBucket(bucketName),
                cancellationToken);
            if (!exists)
            {
                await client.MakeBucketAsync(
                    new MakeBucketArgs().WithBucket(bucketName),
                    cancellationToken);
            }

            bucketReady = true;
        }
        finally
        {
            bucketLock.Release();
        }
    }

    private static string NormalizeEndpoint(string endpoint)
    {
        if (Uri.TryCreate(endpoint, UriKind.Absolute, out var uri))
        {
            return uri.IsDefaultPort ? uri.Host : $"{uri.Host}:{uri.Port}";
        }

        return endpoint.Trim().TrimEnd('/');
    }

    private static string BuildObjectKey(string prefix, string fileName)
    {
        var safePrefix = string.IsNullOrWhiteSpace(prefix)
            ? "uploads"
            : prefix.Trim().Trim('/').Replace('\\', '/');
        var extension = Path.GetExtension(Path.GetFileName(fileName));
        var safeExtension = extension.Length is > 0 and <= 12 ? extension.ToLowerInvariant() : string.Empty;

        return $"{safePrefix}/{DateTime.UtcNow:yyyy/MM}/{Guid.NewGuid():N}{safeExtension}";
    }
}
