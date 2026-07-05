import Link from "next/link";

const projects = [
  {
    name: "Tighomecare.ca",
    category: "Healthcare Services Platform",
    status: "Ongoing Project",
    summary:
      "An ongoing home care website project designed to build trust quickly, communicate services clearly, and make it easy for families to take the next step.",
    highlights: [
      "Clear service presentation for families and caregivers",
      "Professional visual tone that supports trust and credibility",
      "Responsive layout optimized for mobile and desktop browsing",
    ],
    features: [
      "Service pages for home care support and caregiver information",
      "Clear contact and inquiry paths for families seeking care",
      "Mobile-friendly layout for easy access across devices",
      "Trust-focused presentation with clean, professional design",
    ],
    url: "https://tighomecare.ca",
  },
  {
    name: "Feluna Realty Booking",
    category: "Real Estate Booking Platform",
    status: "Ongoing Project",
    summary:
      "An ongoing real estate booking platform designed to support property discovery, agent presentation, and private visit scheduling in a streamlined web experience.",
    highlights: [
      "Landing page built around listings and agent presentation",
      "Private property visit booking flow for prospective clients",
      "Bookings dashboard for managing submitted requests",
    ],
    features: [
      "Agent profile presentation for a more trust-driven real estate experience",
      "Property visit request form for private booking inquiries",
      "Dashboard workflow for reviewing and managing bookings",
      "Structured listing photo support with room for future database growth",
    ],
    url: null,
  },
  {
    name: "Sign Dashboard",
    category: "Sign Shop Operations Platform",
    status: "Ongoing Project",
    summary:
      "An ongoing full-stack dashboard for sign shop operations, bringing CRM, ticketing, inventory, proofing, and file workflows into one connected system.",
    highlights: [
      "CRM, tickets, quotes, inventory, and job order workflows in one platform",
      "Live dashboard updates through SignalR for operational visibility",
      "Integrated artwork uploads, proofing, and customer review links",
    ],
    features: [
      "Production board with status tracking from pending to completion",
      "Artwork upload versioning for design and production teams",
      "Proof review workflow with customer approvals and revision requests",
      "Local agent support for syncing files to customer-managed drives or NAS storage",
    ],
    url: null,
  },
  {
    name: "Stackwatch",
    category: "Website Monitoring SaaS MVP",
    status: "Ongoing Project",
    summary:
      "An ongoing monitoring product built for agencies and operators who need visibility into uptime, SEO issues, conversion risks, and site performance across multiple websites.",
    highlights: [
      "Multi-site monitoring dashboard with portfolio-level risk views",
      "Checks for uptime, response speed, SSL, SEO basics, and conversion signals",
      "SEO Lab support and SaaS-ready database foundation for growth",
    ],
    features: [
      "Add-site workflow for agency and client website monitoring",
      "Run-all and per-site checks for operational visibility",
      "Cloudflare integration path for traffic and page-load analytics",
      "MariaDB-backed SaaS foundation for users, organizations, alerts, and subscriptions",
    ],
    url: null,
  },
  {
    name: "bubbleteabrewers.ca",
    category: "POS and Web App",
    status: "Ongoing Project",
    summary:
      "An ongoing POS and web application project for Bubble Tea Brewers, including a site conversion from PHP to Next.js and integration of the POS system with the backend while streamlining operations and supporting a polished customer-facing digital experience.",
    highlights: [
      "Conversion of the existing website experience from PHP to Next.js",
      "POS workflows designed for practical day-to-day business operations",
      "Integration of the POS system with backend workflows and data handling",
      "Web app experience that supports brand presentation and usability",
      "Built with scalability in mind for future product and operational needs",
    ],
    features: [
      "Modernized frontend architecture through PHP-to-Next.js migration",
      "POS functionality aligned with real business operations",
      "Backend integration for completed sales, operational data, and system workflows",
      "Customer-facing web experience with a cleaner, more maintainable stack",
      "Foundation for future content, product, and operational growth",
    ],
    url: "https://bubbleteabrewers.ca",
  },
  {
    name: "GitHub Portfolio",
    category: "Code Portfolio",
    status: "Active Projects",
    summary:
      "A public GitHub portfolio that brings together development work across web applications, full-stack projects, and practical product builds.",
    highlights: [
      "Public repositories that show real implementation work",
      "A mix of frontend, backend, and full-stack projects",
      "Ongoing development and experimentation across products",
    ],
    features: [
      "Source code available for technical review",
      "Project variety across different business and product needs",
      "Visible coding style, structure, and implementation approach",
      "A central place to explore more of my software work",
    ],
    url: "https://github.com/glennluna",
  },
  {
    name: "bindaddy.ca",
    category: "Customer-Facing Digital Platform",
    status: "Completed Project",
    summary:
      "A completed modern web platform focused on customer journeys, account experiences, and product operations, with an emphasis on clarity, usability, and scalable delivery.",
    highlights: [
      "Customer-centric flows for discovery, booking, and account use",
      "Full-stack implementation thinking across frontend and backend",
      "Built to support growth with maintainable product foundations",
    ],
    features: [
      "Account-based user experience for customer access and management",
      "Booking and service flow support for product interactions",
      "Frontend and backend integration for scalable platform behavior",
      "Structured product pages and operational workflows",
    ],
    url: "https://bindaddy.ca",
  },
];

export const metadata = {
  title: "Projects | Glenn Luna",
  description:
    "Selected software development projects by Glenn Luna, including Tighomecare.ca, Feluna Realty Booking, Sign Dashboard, Stackwatch, bubbleteabrewers.ca, GitHub Portfolio, and bindaddy.ca.",
};

export default function ProjectsPage() {
  return (
    <main className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(27,94,89,0.18),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(221,140,54,0.14),_transparent_26%),linear-gradient(180deg,_#f7f3ec_0%,_#fffdfa_52%,_#f4efe6_100%)]" />

      <section className="mx-auto w-full max-w-7xl px-6 py-8 sm:px-10 lg:px-12">
        <header className="fade-up flex flex-col gap-6 border-b border-black/8 pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-black/45">
              Projects
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-[#152321] sm:text-5xl lg:text-6xl">
              Real web projects built with product focus and strong execution.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-black/68">
              This page highlights selected work that reflects my approach to
              building professional digital experiences: clear communication,
              thoughtful UX, maintainable engineering, and practical business
              value.
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-[#152321]/15 bg-white px-5 py-3 text-sm font-semibold text-[#152321] shadow-[0_12px_28px_rgba(21,35,33,0.08)] transition hover:-translate-y-0.5"
          >
            Back to Home
          </Link>
        </header>
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 py-10 sm:px-10 lg:px-12">
        <div className="grid gap-6">
          {projects.map((project) => (
            <article
              key={project.name}
              className="fade-up rounded-[2.25rem] border border-black/8 bg-white/78 p-8 shadow-[0_24px_60px_rgba(21,35,33,0.08)] backdrop-blur sm:p-10"
            >
              <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-3xl">
                  <p className="font-mono text-xs uppercase tracking-[0.28em] text-[#1b5e59]">
                    {project.category}
                  </p>
                  <div className="mt-4 inline-flex rounded-full border border-[#1b5e59]/15 bg-[#1b5e59]/8 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.24em] text-[#1b5e59]">
                    {project.status}
                  </div>
                  <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-[#152321] sm:text-4xl">
                    {project.name}
                  </h2>
                  <p className="mt-5 text-base leading-8 text-black/68">
                    {project.summary}
                  </p>
                </div>
                {project.url ? (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center rounded-full bg-[#152321] px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#0f1a18]"
                  >
                    Visit Project
                  </a>
                ) : (
                  <div className="inline-flex items-center justify-center rounded-full border border-[#152321]/12 bg-[#152321]/6 px-5 py-3 text-sm font-semibold text-[#152321]">
                    Internal Project
                  </div>
                )}
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {project.highlights.map((highlight) => (
                  <div
                    key={highlight}
                    className="rounded-[1.5rem] border border-black/8 bg-[#fcfaf6] p-5"
                  >
                    <p className="text-sm leading-7 text-[#152321]">
                      {highlight}
                    </p>
                  </div>
                ))}
              </div>

              {project.features ? (
                <div className="mt-8 rounded-[1.75rem] border border-black/8 bg-[#f7f3ec] p-6">
                  <p className="font-mono text-xs uppercase tracking-[0.24em] text-black/45">
                    Key Features
                  </p>
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    {project.features.map((feature) => (
                      <div
                        key={feature}
                        className="rounded-2xl border border-black/8 bg-white px-4 py-4 text-sm leading-7 text-[#152321]"
                      >
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
