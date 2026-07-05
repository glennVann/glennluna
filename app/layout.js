import { IBM_Plex_Mono, Manrope } from "next/font/google";
import "./globals.css";

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
  title: "Glenn Luna | Software Developer",
  description:
    "Professional software developer profile built with Next.js 16 and Tailwind CSS.",
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Glenn Luna",
  jobTitle: "Software Developer",
  description:
    "Software developer focused on polished interfaces, reliable systems, and maintainable product delivery.",
  knowsAbout: [
    "Next.js",
    "React",
    "JavaScript",
    "Tailwind CSS",
    "API Design",
    "Full-Stack Development",
  ],
};

export default function RootLayout({ children }) {
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
      </body>
    </html>
  );
}
