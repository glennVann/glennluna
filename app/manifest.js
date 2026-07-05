export default function manifest() {
  return {
    name: "Glenn Luna Developer Profile",
    short_name: "Glenn Luna",
    description:
      "Portfolio and services site for Glenn Luna covering web development, custom software, technical SEO, server setup, and networking.",
    start_url: "/",
    display: "standalone",
    background_color: "#f7f3ec",
    theme_color: "#152321",
    categories: ["business", "technology", "portfolio"],
    lang: "en-CA",
    icons: [
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
