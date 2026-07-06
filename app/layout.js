import { IBM_Plex_Mono, Manrope } from "next/font/google";
import CookieConsentBanner from "./cookie-consent-banner";
import "./globals.css";

const siteUrl = "https://glennluna.bindaddy.ca";
const siteTitle = "Glenn Luna | Software Developer";
const siteDescription =
  "Glenn Luna builds modern websites, Next.js applications, custom software, server setups, networking solutions, and technical SEO improvements for growing businesses.";
const serviceAreas = [
  "Web Development",
  "Next.js Development",
  "Custom Software Development",
  "Technical SEO",
  "Server Setup",
  "Networking Setup",
];

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitle,
    template: "%s | Glenn Luna",
  },
  description: siteDescription,
  applicationName: "Glenn Luna Developer Profile",
  keywords: [
    "Glenn Luna",
    "software developer",
    "full-stack developer",
    "Next.js developer",
    "web developer",
    "custom software development",
    "technical SEO",
    "server setup",
    "networking setup",
  ],
  authors: [{ name: "Glenn Luna", url: siteUrl }],
  creator: "Glenn Luna",
  publisher: "Glenn Luna",
  category: "technology",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/icon.png", sizes: "512x512", type: "image/png" },
      { url: "/icon.png", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: ["/icon.png"],
  },
  openGraph: {
    type: "website",
    locale: "en_CA",
    url: siteUrl,
    siteName: "Glenn Luna",
    title: siteTitle,
    description: siteDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

const structuredData = [
  {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Glenn Luna",
    url: siteUrl,
    jobTitle: "Software Developer",
    description:
      "Software developer focused on polished interfaces, reliable systems, technical SEO, and maintainable product delivery.",
    email: "mailto:glenncotamuraluna@gmail.com",
    sameAs: [
      "https://www.linkedin.com/in/glenn-luna-62b1ba285/",
      "https://github.com/glennVann",
    ],
    knowsAbout: [
      "Next.js",
      "React",
      "JavaScript",
      "Tailwind CSS",
      "API Design",
      "Full-Stack Development",
      "Technical SEO",
      "Server Setup",
      "Networking",
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Glenn Luna",
    url: siteUrl,
    description: siteDescription,
  },
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Glenn Luna",
    url: siteUrl,
    email: "mailto:glenncotamuraluna@gmail.com",
    sameAs: [
      "https://www.linkedin.com/in/glenn-luna-62b1ba285/",
      "https://github.com/glennVann",
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Glenn Luna Software Development Services",
    url: siteUrl,
    description: siteDescription,
    provider: {
      "@type": "Person",
      name: "Glenn Luna",
    },
    areaServed: {
      "@type": "Country",
      name: "Canada",
    },
    serviceType: serviceAreas,
  },
];

export default function RootLayout({ children }) {
  const currentYear = new Date().getFullYear();

  return (
    <html
      lang="en"
      className={`${manrope.variable} ${plexMono.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--background)] text-[var(--foreground)]">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        {children}
        <CookieConsentBanner />
        <footer className="border-t border-black/8 bg-[#152321] text-white">
          <div className="mx-auto grid w-full max-w-7xl gap-8 px-6 py-10 sm:px-10 lg:grid-cols-[1.1fr_0.9fr_0.8fr] lg:px-12">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-white/45">
                Glenn Luna
              </p>
              <p className="mt-4 max-w-md text-sm leading-7 text-white/72">
                Software developer focused on modern websites, custom software,
                technical SEO, server setup, and dependable product delivery.
              </p>
            </div>

            <div>
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-white/45">
                Navigation
              </p>
              <div className="mt-4 flex flex-col gap-3 text-sm text-white/78">
                <a href="/" className="transition hover:text-white">
                  Home
                </a>
                <a href="/#about" className="transition hover:text-white">
                  About Me
                </a>
                <a href="/projects" className="transition hover:text-white">
                  Projects
                </a>
                <a href="/quote" className="transition hover:text-white">
                  Request Quote
                </a>
              </div>
            </div>

            <div>
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-white/45">
                Contact
              </p>
              <div className="mt-4 flex flex-col gap-3 text-sm text-white/78">
                <a
                  href="mailto:glenncotamuraluna@gmail.com"
                  className="transition hover:text-white"
                >
                  glenncotamuraluna@gmail.com
                </a>
                <a
                  href="https://www.linkedin.com/in/glenn-luna-62b1ba285/"
                  target="_blank"
                  rel="noreferrer"
                  className="transition hover:text-white"
                >
                  LinkedIn
                </a>
                <a
                  href="https://github.com/glennVann"
                  target="_blank"
                  rel="noreferrer"
                  className="transition hover:text-white"
                >
                  GitHub
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-white/8">
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-6 py-4 text-sm text-white/56 sm:px-10 lg:flex-row lg:items-center lg:justify-between lg:px-12">
              <p>&copy; {currentYear} Glenn Luna. All rights reserved.</p>
              <p>Built with Next.js, product focus, and clean execution.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
