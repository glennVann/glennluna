namespace GlennLuna.Api.Configuration;

public static class DotEnvConfiguration
{
    public static void AddMissingValues(IConfigurationManager configuration, string contentRootPath)
    {
        var paths = new[]
        {
            Path.Combine(Directory.GetCurrentDirectory(), ".env"),
            Path.GetFullPath(Path.Combine(contentRootPath, "..", ".env")),
            Path.Combine(contentRootPath, ".env")
        };
        var path = paths.FirstOrDefault(File.Exists);

        if (path is null)
        {
            return;
        }

        var values = new Dictionary<string, string?>(StringComparer.OrdinalIgnoreCase);

        foreach (var rawLine in File.ReadLines(path))
        {
            var line = rawLine.Trim();
            if (line.Length == 0 || line.StartsWith('#'))
            {
                continue;
            }

            var separatorIndex = line.IndexOf('=');
            if (separatorIndex <= 0)
            {
                continue;
            }

            var key = line[..separatorIndex].Trim().Replace("__", ":");
            if (configuration[key] is not null)
            {
                continue;
            }

            var value = line[(separatorIndex + 1)..].Trim();
            if (value.Length >= 2 &&
                ((value[0] == '"' && value[^1] == '"') ||
                 (value[0] == '\'' && value[^1] == '\'')))
            {
                value = value[1..^1];
            }

            values[key] = value;
        }

        configuration.AddInMemoryCollection(values);
    }
}
