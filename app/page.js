import Image from "next/image";
import Link from "next/link";
import TeamSection from "./team-section";

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

export const metadata = {
  description:
    "Glenn Luna builds websites, web apps, and reliable digital systems with a strong focus on usability, SEO, infrastructure, and maintainable code.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Glenn Luna | Software Developer",
    description:
      "Websites, custom apps, SEO, infrastructure, and practical software delivery built with a thoughtful full-stack approach.",
    url: "https://glennluna.bindaddy.ca",
  },
  twitter: {
    title: "Glenn Luna | Software Developer",
    description:
      "Web development, technical SEO, infrastructure support, and dependable product delivery.",
  },
};

const focusAreas = [
  {
    title: "Frontend Engineering",
    description:
      "Responsive interfaces that are straightforward to use on phones, tablets, and desktops.",
  },
  {
    title: "Backend Development",
    description:
      "APIs, business logic, authentication, and integrations that keep the application running behind the scenes.",
  },
  {
    title: "Product Delivery",
    description:
      "Turning an idea into a working release, then improving it based on how people actually use it.",
  },
  {
    title: "SEO and Maintenance",
    description:
      "Search setup, performance work, bug fixes, and updates after the site goes live.",
  },
  {
    title: "Infrastructure Setup",
    description:
      "Servers, networking, deployments, and shared storage when a project needs more than application code.",
  },
];

const strengths = [
  "JavaScript-first full-stack development",
  "Next.js application architecture",
  "REST API design and integration",
  "Domain management and DNS setup",
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
    title: "Domain Management and Setup",
    description:
      "I can connect the domain, configure DNS, route subdomains, and sort out nameserver changes.",
  },
  {
    title: "Server Setup",
    description:
      "I set up VPS hosting, deploy the application, configure the reverse proxy, and check that it starts reliably.",
  },
  {
    title: "Networking",
    description:
      "I work with wired and wireless networks, fiber connections, routing, switching, and internal DNS.",
  },
  {
    title: "File Server Setup",
    description:
      "Shared storage, sensible folder structures, access control, and file workflows for day-to-day work.",
  },
  {
    title: "SEO and Maintenance",
    description:
      "I handle search improvements, fixes, upgrades, and the small jobs that keep a live site healthy.",
  },
];

const featuredProjects = [
  {
    title: "Tighomecare.ca",
    summary:
      "An ongoing care services project focused on making it easier for families to understand the services, build trust quickly, and reach out with confidence.",
    tags: ["Ongoing", "Healthcare", "Responsive Design"],
    href: "/projects",
  },
  {
    title: "bubbleteabrewers.ca",
    summary:
      "An ongoing POS and web app project for Bubble Tea Brewers, including a move from PHP to Next.js and better backend integration to support smoother day-to-day operations.",
    tags: ["Ongoing", "POS", "Backend Integration"],
    href: "/projects",
  },
  {
    title: "GitHub Portfolio",
    summary:
      "A public collection of my code and project work across websites, web apps, and full-stack builds.",
    tags: ["GitHub", "Code Portfolio", "Open Source"],
    href: "/projects",
  },
  {
    title: "bindaddy.ca",
    summary:
      "A completed platform built around customer experience, account access, and the day-to-day flow of a real product.",
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

const aboutMePoints = [
  "I like making complicated jobs simpler for the person who has to use the software every day.",
  "I can work across the interface, backend, database, server, and network instead of treating them as separate problems.",
  "I’m comfortable starting with a rough idea and working through the details until there is something useful and working.",
  "I completed a Software Development diploma at SAIT, where I built a strong practical foundation in application development.",
  "My background in Telecom Engineering is useful when a job also involves networking, infrastructure, or system planning.",
];

export default function Home() {
  return (
    <main className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(27,94,89,0.18),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(221,140,54,0.16),_transparent_22%),linear-gradient(180deg,_#f7f3ec_0%,_#fffdfa_46%,_#f4efe6_100%)]" />
      <div className="absolute inset-x-0 top-0 -z-10 h-96 bg-[linear-gradient(to_bottom,_rgba(255,255,255,0.72),_transparent)]" />

      <section className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-10 sm:px-10 lg:px-12">
        <div className="grid flex-1 gap-12 py-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:py-16">
          <section className="fade-up space-y-8">
            <div className="inline-flex items-center rounded-full border border-[#1b5e59]/20 bg-[#1b5e59]/8 px-4 py-2 font-mono text-xs uppercase tracking-[0.24em] text-[#1b5e59]">
              Software Developer
            </div>

            <div className="space-y-6">
              <h2 className="max-w-4xl text-5xl font-semibold tracking-[-0.05em] text-[#152321] sm:text-6xl lg:text-7xl">
                I build websites and web apps that work in the real world.
              </h2>
              <p className="max-w-2xl text-lg leading-8 text-black/68 sm:text-xl">
                I&apos;m Glenn, a software developer in Calgary. I work on
                everything from the interface and backend to deployment, DNS,
                and the server it runs on. I care about making things useful,
                reliable, and easy to look after.
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
                  Websites, custom web apps, technical SEO, and the systems
                  needed to run them.
                </p>
              </div>
              <div className="rounded-[1.75rem] border border-black/8 bg-white/72 p-5 shadow-[0_18px_45px_rgba(21,35,33,0.08)] backdrop-blur">
                <p className="font-mono text-xs uppercase tracking-[0.22em] text-black/45">
                  Strength
                </p>
                <p className="mt-3 text-sm leading-7 text-black/70">
                  Working across design, code, servers, and networking when a
                  project calls for it.
                </p>
              </div>
              <div className="rounded-[1.75rem] border border-black/8 bg-white/72 p-5 shadow-[0_18px_45px_rgba(21,35,33,0.08)] backdrop-blur">
                <p className="font-mono text-xs uppercase tracking-[0.22em] text-black/45">
                  Approach
                </p>
                <p className="mt-3 text-sm leading-7 text-black/70">
                  I ask questions, explain the tradeoffs, and keep the work
                  understandable from start to finish.
                </p>
              </div>
            </div>
          </section>

          <aside className="fade-up relative">
            <div className="absolute inset-x-10 inset-y-8 -z-10 rounded-[2rem] bg-[#dd8c36]/12 blur-3xl" />
            <div className="rounded-[2rem] border border-[#152321]/10 bg-[#152321] p-8 text-white shadow-[0_24px_70px_rgba(21,35,33,0.18)]">
              <p className="font-mono text-xs uppercase tracking-[0.26em] text-white/55">
                Cloud And Infrastructure
              </p>
              <div className="mt-6 overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#07111f] shadow-[0_20px_50px_rgba(0,0,0,0.22)]">
                <Image
                  src="/cloud-infrastructure-illustration.png"
                  alt="Isometric cloud infrastructure illustration with servers, networking, dashboards, and connected services"
                  width={1536}
                  height={1024}
                  className="h-auto w-full object-cover"
                  priority
                />
              </div>
              <div className="mt-8 space-y-6">
                <div>
                  <p className="text-sm text-white/55">Primary Focus</p>
                  <p className="mt-2 text-2xl font-semibold">
                    From the interface to deployment
                  </p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/45">
                      Specialties
                    </p>
                    <p className="mt-3 text-sm leading-7 text-white/78">
                      Web apps, APIs, integrations, interface work, and
                      production deployments.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/45">
                      Value
                    </p>
                    <p className="mt-3 text-sm leading-7 text-white/78">
                      One person who can follow a problem across the app,
                      hosting, DNS, and network.
                    </p>
                  </div>
                </div>
                <div className="rounded-[1.5rem] border border-white/10 bg-white/6 p-5">
                  <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/45">
                    Working Style
                  </p>
                  <p className="mt-3 text-sm leading-7 text-white/78">
                    I prefer practical decisions, readable code, and honest
                    updates. If something is unclear or risky, I&apos;ll say so
                    and work through it with you.
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
              The parts of a project I usually handle.
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
              I also handle what happens around the application.
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
            I care about how the software works after launch.
          </h3>
          <p className="mt-5 text-base leading-8 text-black/68">
            A project is not finished just because it compiles. It needs to be
            understandable, usable, deployed properly, and manageable when
            something changes later.
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
        id="about"
        className="mx-auto w-full max-w-7xl px-6 py-8 sm:px-10 lg:px-12"
      >
        <div className="fade-up grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[2rem] border border-black/8 bg-[#152321] p-8 text-white shadow-[0_24px_60px_rgba(21,35,33,0.16)] sm:p-10">
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-white/50">
              About Me
            </p>
            <h3 className="mt-4 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
              I&apos;m a software developer with a background in telecom.
            </h3>
            <p className="mt-5 text-base leading-8 text-white/76">
              I enjoy work that mixes software with real operational problems.
              That might mean building a web app, fixing its deployment, or
              tracing a network issue that is getting in the way.
            </p>
          </div>

          <div className="rounded-[2rem] border border-black/8 bg-white/75 p-8 shadow-[0_24px_60px_rgba(21,35,33,0.08)] backdrop-blur sm:p-10">
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-black/45">
              Working Perspective
            </p>
            <div className="mt-6 grid gap-4">
              {aboutMePoints.map((point) => (
                <div
                  key={point}
                  className="rounded-[1.5rem] border border-black/8 bg-[#fcfaf6] p-5"
                >
                  <p className="text-sm leading-7 text-[#152321]">{point}</p>
                </div>
              ))}
            </div>
            <Link
              href="/about"
              className="mt-6 inline-flex items-center justify-center rounded-full border border-[#152321]/15 bg-white px-5 py-3 text-sm font-semibold text-[#152321] transition hover:-translate-y-0.5"
            >
              Open Full About Page
            </Link>
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
              A few things I&apos;ve built or am currently working on.
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

      <TeamSection />

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
                Have a project in mind?
              </h3>
              <p className="mt-4 text-base leading-8 text-black/68">
                Send me what you know so far, even if it is still rough. I can
                help work out the scope, the technical approach, and what to do
                first.
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
                Let&apos;s talk about what you&apos;re building.
              </h3>
              <p className="mt-4 text-base leading-8 text-white/76">
                Email me or send a quote request with the problem you are trying
                to solve. I&apos;ll get back to you with questions and a practical
                next step.
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
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/14 bg-white/8 px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/12"
              >
                {linkedInIcon}
                LinkedIn Profile
              </a>
              <a
                href="https://github.com/glennVann"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/14 bg-white/8 px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/12"
              >
                {githubIcon}
                GitHub
              </a>
              <a
                href="https://www.facebook.com/glenn.luna.100104"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/14 bg-white/8 px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/12"
              >
                {facebookIcon}
                Facebook
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
