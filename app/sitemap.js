const siteUrl = "https://glennluna.bindaddy.ca";

export default function sitemap() {
  const lastModified = new Date();

  return [
    {
      url: siteUrl,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/projects`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/quote`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}
