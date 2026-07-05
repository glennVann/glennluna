import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Software Developer",
  description:
    "Glenn Luna builds Next.js websites, custom web apps, technical SEO improvements, server setups, networking solutions, and maintainable full-stack software.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Glenn Luna | Software Developer",
    description:
      "Modern websites, custom web apps, technical SEO, server setup, and networking support built with a full-stack product mindset.",
    url: "https://glennluna.bindaddy.ca",
  },
  twitter: {
    title: "Glenn Luna | Software Developer",
    description:
      "Next.js development, technical SEO, infrastructure setup, and full-stack product delivery.",
  },
};

const focusAreas = [
  {
    title: "Frontend Engineering",
    description:
      "Responsive, high-quality interfaces with thoughtful UX, strong accessibility, and maintainable component systems.",
  },
  {
    title: "Backend Development",
    description:
      "Clean APIs, structured business logic, and reliable integrations that support product growth without adding chaos.",
  },
  {
    title: "Product Delivery",
    description:
      "A practical engineering approach that balances speed, code quality, and collaboration across design and business goals.",
  },
  {
    title: "SEO and Maintenance",
    description:
      "Search visibility improvements, technical SEO fundamentals, and ongoing web application maintenance that keep products healthy after launch.",
  },
  {
    title: "Infrastructure Setup",
    description:
      "Server setup, custom Layer 2 and Layer 3 network configuration, wireless deployment, fiber optic connectivity, deployment workflows, and file server structure that support reliable day-to-day operations.",
  },
];

const strengths = [
  "JavaScript-first full-stack development",
  "Next.js application architecture",
  "REST API design and integration",
  "Server setup and deployment workflows",
  "Layer 2 and Layer 3 network configuration",
  "Custom wireless and fiber optic network setup",
  "File server and shared storage organization",
  "SEO improvements and web application maintenance",
  "Performance-focused UI implementation",
  "Clear communication with cross-functional teams",
];

const serviceAreas = [
  {
    title: "Server Setup",
    description:
      "Application deployment, VPS setup, reverse proxy configuration, and production-ready runtime structure.",
  },
  {
    title: "Networking",
    description:
      "Custom Layer 2 and Layer 3 network configuration, wireless setup, fiber optic connectivity, domain routing, DNS planning, internal connectivity, and practical infrastructure setup for live systems.",
  },
  {
    title: "File Server Setup",
    description:
      "Shared storage organization, operational folder structures, and file workflow planning for business teams.",
  },
  {
    title: "SEO and Maintenance",
    description:
      "Technical SEO support, performance upkeep, bug fixes, updates, and ongoing maintenance for live web applications.",
  },
];

const featuredProjects = [
  {
    title: "Tighomecare.ca",
    summary:
      "An ongoing care services website project focused on trust, clarity, and a smooth path for families exploring home care support.",
    tags: ["Ongoing", "Healthcare", "Responsive Design"],
    href: "/projects",
  },
  {
    title: "bubbleteabrewers.ca",
    summary:
      "An ongoing POS and web app project for Bubble Tea Brewers that includes converting the site from PHP to Next.js and integrating the POS system with the backend for smoother operations.",
    tags: ["Ongoing", "POS", "Backend Integration"],
    href: "/projects",
  },
  {
    title: "GitHub Portfolio",
    summary:
      "A public collection of development work showcasing web applications, full-stack builds, and ongoing software projects.",
    tags: ["GitHub", "Code Portfolio", "Open Source"],
    href: "/projects",
  },
  {
    title: "bindaddy.ca",
    summary:
      "A completed digital platform built around customer experience, account flows, and scalable product operations.",
    tags: ["Completed", "Account Experience", "Full-Stack"],
    href: "/projects",
  },
];

const stackGroups = [
  {
    label: "Frontend",
    items: ["Next.js 16", "React", "JavaScript", "Tailwind CSS"],
  },
  {
    label: "Backend",
    items: ["Node.js", "API Design", "Authentication", "Data Modeling"],
  },
  {
    label: "Workflow",
    items: ["Git", "Code Review", "Testing", "Maintenance"],
  },
  {
    label: "Infrastructure",
    items: [
      "Server Setup",
      "L2/L3 Networking",
      "Wireless Setup",
      "Fiber Optic",
    ],
  },
];

export default function Home() {
  return (
    <main className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(27,94,89,0.18),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(221,140,54,0.16),_transparent_22%),linear-gradient(180deg,_#f7f3ec_0%,_#fffdfa_46%,_#f4efe6_100%)]" />
      <div className="absolute inset-x-0 top-0 -z-10 h-96 bg-[linear-gradient(to_bottom,_rgba(255,255,255,0.72),_transparent)]" />

      <section className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-8 sm:px-10 lg:px-12">
        <header className="fade-up flex items-center justify-between border-b border-black/8 pb-5">
          <div className="flex items-center gap-4">
            <div className="overflow-hidden rounded-2xl border border-black/10 bg-[#07111f] shadow-[0_14px_32px_rgba(7,17,31,0.18)]">
              <Image
                src="/glenn-luna-logo.png"
                alt="Glenn Luna logo"
                width={64}
                height={64}
                className="h-14 w-14 object-cover sm:h-16 sm:w-16"
                priority
              />
            </div>
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-black/50">
                Developer Profile
              </p>
              <h1 className="mt-2 text-lg font-semibold text-[#152321]">
                Glenn Luna
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/quote"
              className="rounded-full bg-[#152321] px-4 py-2 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(21,35,33,0.12)] transition hover:-translate-y-0.5 hover:bg-[#0f1a18]"
            >
              Request Quote
            </Link>
            <a
              href="#contact"
              className="rounded-full border border-[#152321]/15 bg-white/80 px-4 py-2 text-sm font-semibold text-[#152321] shadow-[0_12px_28px_rgba(21,35,33,0.08)] transition hover:-translate-y-0.5 hover:bg-white"
            >
              Contact
            </a>
          </div>
        </header>

        <div className="grid flex-1 gap-12 py-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:py-16">
          <section className="fade-up space-y-8">
            <div className="inline-flex items-center rounded-full border border-[#1b5e59]/20 bg-[#1b5e59]/8 px-4 py-2 font-mono text-xs uppercase tracking-[0.24em] text-[#1b5e59]">
              Software Developer
            </div>

            <div className="space-y-6">
              <h2 className="max-w-4xl text-5xl font-semibold tracking-[-0.05em] text-[#152321] sm:text-6xl lg:text-7xl">
                Building thoughtful digital products with strong engineering
                foundations.
              </h2>
              <p className="max-w-2xl text-lg leading-8 text-black/68 sm:text-xl">
                I create modern websites, Next.js applications, custom web
                software, technical SEO improvements, and practical
                infrastructure setups. My focus is on building digital products
                that feel professional, perform well, and stay maintainable as
                business needs evolve.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                href="/projects"
                className="inline-flex items-center justify-center rounded-full bg-[#152321] px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#0f1a18]"
              >
                View Projects
              </Link>
              <Link
                href="/quote"
                className="inline-flex items-center justify-center rounded-full border border-[#152321]/15 bg-white/70 px-6 py-3 text-sm font-semibold text-[#152321] transition hover:-translate-y-0.5 hover:bg-white"
              >
                Get A Project Quote
              </Link>
            </div>

            <div className="grid gap-4 pt-4 sm:grid-cols-3">
              <div className="rounded-[1.75rem] border border-black/8 bg-white/72 p-5 shadow-[0_18px_45px_rgba(21,35,33,0.08)] backdrop-blur">
                <p className="font-mono text-xs uppercase tracking-[0.22em] text-black/45">
                  Focus
                </p>
                <p className="mt-3 text-sm leading-7 text-black/70">
                  Next.js web apps, scalable interfaces, technical SEO, and
                  dependable product delivery.
                </p>
              </div>
              <div className="rounded-[1.75rem] border border-black/8 bg-white/72 p-5 shadow-[0_18px_45px_rgba(21,35,33,0.08)] backdrop-blur">
                <p className="font-mono text-xs uppercase tracking-[0.22em] text-black/45">
                  Strength
                </p>
                <p className="mt-3 text-sm leading-7 text-black/70">
                  Balancing thoughtful design, technical quality, and business
                  practicality.
                </p>
              </div>
              <div className="rounded-[1.75rem] border border-black/8 bg-white/72 p-5 shadow-[0_18px_45px_rgba(21,35,33,0.08)] backdrop-blur">
                <p className="font-mono text-xs uppercase tracking-[0.22em] text-black/45">
                  Approach
                </p>
                <p className="mt-3 text-sm leading-7 text-black/70">
                  Clear communication, reliable execution, and maintainable
                  code from planning through launch.
                </p>
              </div>
            </div>
          </section>

          <aside className="fade-up relative">
            <div className="absolute inset-x-10 inset-y-8 -z-10 rounded-[2rem] bg-[#dd8c36]/12 blur-3xl" />
            <div className="rounded-[2rem] border border-[#152321]/10 bg-[#152321] p-8 text-white shadow-[0_24px_70px_rgba(21,35,33,0.18)]">
              <p className="font-mono text-xs uppercase tracking-[0.26em] text-white/55">
                Professional Snapshot
              </p>
              <div className="mt-8 space-y-6">
                <div>
                  <p className="text-sm text-white/55">Primary Role</p>
                  <p className="mt-2 text-2xl font-semibold">
                    Full-Stack Software Developer
                  </p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/45">
                      Specialties
                    </p>
                    <p className="mt-3 text-sm leading-7 text-white/78">
                      Product engineering, API integration, and scalable UI
                      systems.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/45">
                      Value
                    </p>
                    <p className="mt-3 text-sm leading-7 text-white/78">
                      Professional execution with a strong eye for user
                      experience.
                    </p>
                  </div>
                </div>
                <div className="rounded-[1.5rem] border border-white/10 bg-white/6 p-5">
                  <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/45">
                    Working Style
                  </p>
                  <p className="mt-3 text-sm leading-7 text-white/78">
                    I enjoy turning complex requirements into clear product
                    decisions, stable codebases, and interfaces that look
                    intentional on every screen size.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section
        id="expertise"
        className="mx-auto w-full max-w-7xl px-6 pb-8 sm:px-10 lg:px-12"
      >
        <div className="fade-up rounded-[2.25rem] border border-black/8 bg-white/70 p-8 shadow-[0_24px_60px_rgba(21,35,33,0.08)] backdrop-blur sm:p-10">
          <div className="max-w-2xl">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-black/45">
              Core Expertise
            </p>
            <h3 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-[#152321] sm:text-4xl">
              Engineering with clarity, polish, and long-term maintainability.
            </h3>
          </div>
          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {focusAreas.map((area) => (
              <article
                key={area.title}
                className="rounded-[1.75rem] border border-black/8 bg-[#fcfaf6] p-6"
              >
                <h4 className="text-xl font-semibold text-[#152321]">
                  {area.title}
                </h4>
                <p className="mt-4 text-sm leading-7 text-black/68">
                  {area.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 py-8 sm:px-10 lg:px-12">
        <div className="fade-up rounded-[2.25rem] border border-black/8 bg-white/72 p-8 shadow-[0_24px_60px_rgba(21,35,33,0.08)] backdrop-blur sm:p-10">
          <div className="max-w-2xl">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-black/45">
              Infrastructure Services
            </p>
            <h3 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-[#152321] sm:text-4xl">
              Beyond the app build, I also support the systems around it.
            </h3>
          </div>
          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {serviceAreas.map((service) => (
              <article
                key={service.title}
                className="rounded-[1.75rem] border border-black/8 bg-[#fcfaf6] p-6"
              >
                <h4 className="text-xl font-semibold text-[#152321]">
                  {service.title}
                </h4>
                <p className="mt-4 text-sm leading-7 text-black/68">
                  {service.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-6 px-6 py-8 sm:px-10 lg:grid-cols-[0.95fr_1.05fr] lg:px-12">
        <div className="fade-up rounded-[2rem] border border-black/8 bg-[#f3ece0] p-8">
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-black/45">
            Professional Profile
          </p>
          <h3 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-[#152321]">
            A developer who cares about both the build and the outcome.
          </h3>
          <p className="mt-5 text-base leading-8 text-black/68">
            I approach software development as a mix of engineering discipline
            and product thinking. That means writing code that is easy to
            maintain, solving the right problems, and making sure the final
            experience feels complete to the people using it.
          </p>
        </div>

        <div className="fade-up rounded-[2rem] border border-black/8 bg-white/75 p-8 shadow-[0_18px_40px_rgba(21,35,33,0.06)] backdrop-blur">
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-black/45">
            What I Bring
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {strengths.map((strength) => (
              <div
                key={strength}
                className="rounded-2xl border border-black/8 bg-[#fffdf8] px-4 py-4 text-sm font-medium text-[#152321]"
              >
                {strength}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="projects"
        className="mx-auto w-full max-w-7xl px-6 py-8 sm:px-10 lg:px-12"
      >
        <div className="fade-up">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-black/45">
            Featured Projects
          </p>
          <div className="mt-4 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <h3 className="max-w-2xl text-3xl font-semibold tracking-[-0.04em] text-[#152321] sm:text-4xl">
              Real client and product work presented on a dedicated projects
              page.
            </h3>
            <Link
              href="/projects"
              className="inline-flex items-center justify-center rounded-full border border-[#152321]/15 bg-white px-5 py-3 text-sm font-semibold text-[#152321] shadow-[0_12px_28px_rgba(21,35,33,0.08)] transition hover:-translate-y-0.5"
            >
              Open Projects Page
            </Link>
          </div>
          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            {featuredProjects.map((project) => (
              <article
                key={project.title}
                className="rounded-[2rem] border border-black/8 bg-[#152321] p-7 text-white shadow-[0_20px_50px_rgba(21,35,33,0.16)]"
              >
                <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-white/45">
                  Selected Project
                </p>
                <h4 className="mt-4 text-2xl font-semibold">{project.title}</h4>
                <p className="mt-4 text-sm leading-7 text-white/75">
                  {project.summary}
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/12 bg-white/7 px-3 py-1 text-xs font-medium text-white/72"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <Link
                  href={project.href}
                  className="mt-6 inline-flex items-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#152321] transition hover:-translate-y-0.5"
                >
                  View details
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 py-8 sm:px-10 lg:px-12">
        <div className="fade-up rounded-[2.25rem] border border-black/8 bg-white/72 p-8 shadow-[0_24px_60px_rgba(21,35,33,0.08)] backdrop-blur sm:p-10">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-black/45">
            Toolkit
          </p>
          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {stackGroups.map((group) => (
              <div
                key={group.label}
                className="rounded-[1.75rem] border border-black/8 bg-[#fcfaf6] p-6"
              >
                <h4 className="text-lg font-semibold text-[#152321]">
                  {group.label}
                </h4>
                <div className="mt-5 flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <span
                      key={item}
                      className="rounded-full bg-[#152321] px-3 py-1.5 text-xs font-medium text-white"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 py-8 sm:px-10 lg:px-12">
        <div className="fade-up rounded-[2.25rem] border border-[#dd8c36]/12 bg-[linear-gradient(135deg,_#fff8ef_0%,_#fcfaf6_48%,_#f3ece0_100%)] p-8 shadow-[0_24px_60px_rgba(21,35,33,0.08)] sm:p-10">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#1b5e59]">
            Project Quote
          </p>
          <div className="mt-5 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <h3 className="text-3xl font-semibold tracking-[-0.04em] text-[#152321] sm:text-4xl">
                Need a website, platform, or custom software build?
              </h3>
              <p className="mt-4 text-base leading-8 text-black/68">
                Share your goals, timeline, and budget range through a dedicated
                quote request page. Your inquiry will be prepared and sent to
                `info@bindaddy.ca`.
              </p>
            </div>
            <Link
              href="/quote"
              className="inline-flex items-center justify-center rounded-full bg-[#152321] px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#0f1a18]"
            >
              Request A Quote
            </Link>
          </div>
        </div>
      </section>

      <section
        id="contact"
        className="mx-auto w-full max-w-7xl px-6 py-8 pb-16 sm:px-10 lg:px-12 lg:pb-20"
      >
        <div className="fade-up rounded-[2.25rem] border border-[#1b5e59]/10 bg-[linear-gradient(135deg,_#1b5e59_0%,_#152321_100%)] p-8 text-white shadow-[0_30px_70px_rgba(21,35,33,0.18)] sm:p-10">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-white/50">
            Contact
          </p>
          <div className="mt-5 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <h3 className="text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
                Open to building thoughtful digital products and strong web
                experiences.
              </h3>
              <p className="mt-4 text-base leading-8 text-white/76">
                This profile is designed to present a clean, credible software
                developer brand. Replace the contact details below with your
                preferred links and it is ready to use as a personal portfolio
                site.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href="mailto:glenncotamuraluna@gmail.com"
                className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#152321] transition hover:-translate-y-0.5"
              >
                glenncotamuraluna@gmail.com
              </a>
              <Link
                href="/quote"
                className="inline-flex items-center justify-center rounded-full border border-white/14 bg-white/8 px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/12"
              >
                Project Quote
              </Link>
              <a
                href="https://www.linkedin.com/in/glenn-luna-62b1ba285/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-full border border-white/14 bg-white/8 px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/12"
              >
                LinkedIn Profile
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
