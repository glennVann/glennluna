import { IBM_Plex_Mono, Manrope } from "next/font/google";
import CookieConsentBanner from "./cookie-consent-banner";
import NavbarAuth from "./navbar-auth";
import Image from "next/image";
import Link from "next/link";
import "./globals.css";

const siteUrl = "https://glennluna.bindaddy.ca";
const siteTitle = "Glenn Luna | Software Developer";
const siteDescription =
  "Glenn Luna builds websites, web apps, and reliable digital systems with a focus on usability, SEO, infrastructure, and maintainable code.";
const serviceAreas = [
  "Web Development",
  "Next.js Development",
  "Custom Software Development",
  "Technical SEO",
  "Domain Management and Setup",
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
  const linkedInIcon = (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4 fill-current"
    >
      <path d="M6.94 8.5H3.56V20h3.38zm-1.69-5.8A1.96 1.96 0 1 0 5.3 6.62a1.96 1.96 0 0 0-.05-3.92M20 20h-3.37v-5.59c0-1.33-.03-3.05-1.86-3.05s-2.15 1.45-2.15 2.95V20H9.25V8.5h3.24v1.57h.05a3.55 3.55 0 0 1 3.19-1.75c3.41 0 4.04 2.24 4.04 5.15z" />
    </svg>
  );
  const githubIcon = (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4 fill-current"
    >
      <path d="M12 .5a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.41-4.04-1.41-.55-1.38-1.34-1.74-1.34-1.74-1.09-.74.08-.72.08-.72 1.2.09 1.83 1.24 1.83 1.24 1.07 1.83 2.8 1.3 3.49 1 .11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.94 0-1.31.47-2.39 1.24-3.23-.12-.31-.54-1.53.12-3.2 0 0 1.01-.32 3.3 1.23A11.4 11.4 0 0 1 12 6.3c1.02 0 2.05.14 3.01.41 2.28-1.55 3.29-1.23 3.29-1.23.66 1.67.24 2.89.12 3.2.77.84 1.24 1.92 1.24 3.23 0 4.62-2.8 5.64-5.48 5.93.43.37.82 1.1.82 2.22v3.29c0 .32.21.69.83.58A12 12 0 0 0 12 .5" />
    </svg>
  );
  const facebookIcon = (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4 fill-current"
    >
      <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.88 3.77-3.88 1.09 0 2.23.2 2.23.2v2.45h-1.26c-1.24 0-1.62.77-1.62 1.56V12h2.76l-.44 2.89h-2.32v6.99A10 10 0 0 0 22 12" />
    </svg>
  );

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
        <header className="sticky top-0 z-40 border-b border-black/8 bg-[rgba(255,253,250,0.9)] backdrop-blur">
          <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4 sm:px-10 lg:px-12">
            <Link href="/" className="flex items-center gap-3">
              <div className="overflow-hidden rounded-2xl border border-black/10 bg-[#07111f] shadow-[0_12px_28px_rgba(21,35,33,0.16)]">
                <Image
                  src="/glenn-luna-logo.png"
                  alt="Glenn Luna logo"
                  width={44}
                  height={44}
                  className="h-11 w-11 object-cover"
                  priority
                />
              </div>
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-black/40">
                  Software Developer
                </p>
                <p className="mt-1 text-sm font-semibold text-[#152321]">
                  Glenn Luna
                </p>
              </div>
            </Link>

            <nav className="flex flex-wrap items-center justify-end gap-2 sm:gap-3">
              <Link
                href="/"
                className="rounded-full border border-[#152321]/12 bg-white/80 px-4 py-2 text-sm font-semibold text-[#152321] transition hover:-translate-y-0.5 hover:bg-white"
              >
                Home
              </Link>
              <Link
                href="/about"
                className="rounded-full border border-[#152321]/12 bg-white/80 px-4 py-2 text-sm font-semibold text-[#152321] transition hover:-translate-y-0.5 hover:bg-white"
              >
                About Me
              </Link>
              <Link
                href="/projects"
                className="rounded-full border border-[#152321]/12 bg-white/80 px-4 py-2 text-sm font-semibold text-[#152321] transition hover:-translate-y-0.5 hover:bg-white"
              >
                Projects
              </Link>
              <a
                href="/#contact"
                className="rounded-full border border-[#152321]/12 bg-white/80 px-4 py-2 text-sm font-semibold text-[#152321] transition hover:-translate-y-0.5 hover:bg-white"
              >
                Contact
              </a>
              <Link
                href="/quote"
                className="rounded-full bg-[#152321] px-4 py-2 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(21,35,33,0.12)] transition hover:-translate-y-0.5 hover:bg-[#0f1a18]"
              >
                Request Quote
              </Link>
              <NavbarAuth />
            </nav>
          </div>
        </header>
        {children}
        <CookieConsentBanner />
        <footer className="border-t border-black/8 bg-[#152321] text-white">
          <div className="mx-auto grid w-full max-w-7xl gap-8 px-6 py-10 sm:px-10 lg:grid-cols-[1.1fr_0.9fr_0.8fr] lg:px-12">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-white/45">
                Glenn Luna
              </p>
              <p className="mt-4 max-w-md text-sm leading-7 text-white/72">
                Software developer focused on websites, custom software,
                technical SEO, infrastructure support, and dependable delivery.
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
                <a href="/about" className="transition hover:text-white">
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
                  className="inline-flex items-center gap-2 transition hover:text-white"
                >
                  {linkedInIcon}
                  LinkedIn
                </a>
                <a
                  href="https://github.com/glennVann"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 transition hover:text-white"
                >
                  {githubIcon}
                  GitHub
                </a>
                <a
                  href="https://www.facebook.com/glenn.luna.100104"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 transition hover:text-white"
                >
                  {facebookIcon}
                  Facebook
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-white/8">
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-6 py-4 text-sm text-white/56 sm:px-10 lg:flex-row lg:items-center lg:justify-between lg:px-12">
              <p>&copy; {currentYear} Glenn Luna. All rights reserved.</p>
              <p>Built with care, clear thinking, and solid execution.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
