import Link from "next/link";
import { projects } from "./project-data";

export const metadata = {
  title: "Projects",
  description:
    "Selected software development projects by Glenn Luna, including Tighomecare.ca, Feluna Realty Booking, Sign Dashboard, Stackwatch, bubbleteabrewers.ca, GitHub Portfolio, and bindaddy.ca.",
  alternates: {
    canonical: "/projects",
  },
  openGraph: {
    title: "Projects | Glenn Luna",
    description:
      "Explore selected web development, platform, dashboard, SaaS, and full-stack software projects built by Glenn Luna.",
    url: "https://glennluna.bindaddy.ca/projects",
  },
  twitter: {
    title: "Projects | Glenn Luna",
    description:
      "Selected product, web application, and software engineering projects by Glenn Luna.",
  },
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
                <div className="flex flex-col gap-3">
                  <Link
                    href={`/projects/${project.slug}`}
                    className="inline-flex items-center justify-center rounded-full bg-[#152321] px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#0f1a18]"
                  >
                    View Project Details
                  </Link>
                  <div className="inline-flex items-center justify-center rounded-full border border-[#152321]/12 bg-[#152321]/6 px-5 py-3 text-sm font-semibold text-[#152321]">
                    Portfolio Project
                  </div>
                </div>
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
