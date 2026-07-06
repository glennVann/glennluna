import Link from "next/link";

const values = [
  {
    title: "Product Thinking",
    description:
      "I like building software that solves real problems clearly, instead of adding complexity for its own sake.",
  },
  {
    title: "Reliable Delivery",
    description:
      "My focus is not only getting features working, but making sure the result is stable, maintainable, and practical to run.",
  },
  {
    title: "Technical Range",
    description:
      "I work across modern frontend development, backend logic, technical SEO, server setup, DNS, networking, and deployment workflows.",
  },
];

const workingStyle = [
  "I enjoy taking a project from rough idea to a structured, working system.",
  "I care about interfaces looking intentional and the underlying code staying manageable.",
  "I try to balance business goals, user experience, and technical quality in the same build.",
];

const education = {
  school: "Southern Alberta Institute of Technology (SAIT)",
  credential: "Diploma in Software Development",
  description:
    "Formal software development training with a focus on practical application, technical foundations, and building production-ready digital systems.",
};

export const metadata = {
  title: "About Me",
  description:
    "Learn more about Glenn Luna, a software developer focused on web applications, technical SEO, infrastructure support, and dependable product delivery.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About Me | Glenn Luna",
    description:
      "Software developer profile covering product thinking, technical range, and a practical approach to modern web projects.",
    url: "https://glennluna.bindaddy.ca/about",
  },
  twitter: {
    title: "About Me | Glenn Luna",
    description:
      "Learn more about Glenn Luna’s approach to software, SEO, infrastructure, and product delivery.",
  },
};

export default function AboutPage() {
  return (
    <main className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(27,94,89,0.18),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(221,140,54,0.14),_transparent_26%),linear-gradient(180deg,_#f7f3ec_0%,_#fffdfa_52%,_#f4efe6_100%)]" />

      <section className="mx-auto w-full max-w-7xl px-6 py-8 sm:px-10 lg:px-12">
        <header className="fade-up flex flex-col gap-6 border-b border-black/8 pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-black/45">
              About Me
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-[#152321] sm:text-5xl lg:text-6xl">
              A software developer focused on useful systems, clean execution,
              and long-term maintainability.
            </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-black/68">
              I&apos;m Glenn Luna. I build modern websites, custom web
              applications, technical SEO improvements, infrastructure support,
              and practical digital systems that are meant to work well beyond
              launch day. I also bring a background in Telecom Engineering,
              which supports the networking, connectivity, and systems side of
              the work I do.
            </p>
          </div>
          <Link
            href="/quote"
            className="inline-flex items-center justify-center rounded-full bg-[#152321] px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(21,35,33,0.12)] transition hover:-translate-y-0.5 hover:bg-[#0f1a18]"
          >
            Request Quote
          </Link>
        </header>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-6 px-6 py-10 sm:px-10 lg:grid-cols-[1fr_1fr] lg:px-12">
        <div className="fade-up rounded-[2rem] border border-black/8 bg-[#152321] p-8 text-white shadow-[0_24px_60px_rgba(21,35,33,0.16)] sm:p-10">
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-white/50">
            My Perspective
          </p>
          <p className="mt-5 text-base leading-8 text-white/78">
            I approach development as a mix of engineering discipline and
            product practicality. That means building interfaces people can use
            easily, systems teams can maintain confidently, and delivery flows
            that support real business goals.
          </p>
          <p className="mt-5 text-base leading-8 text-white/78">
            I enjoy projects that need both technical depth and clear judgment:
            web applications, platform builds, domain and DNS setup, server
            delivery, technical SEO, and cross-functional execution from idea
            to launch. My background in Telecom Engineering also gives me a
            strong perspective on networking, connectivity, and infrastructure
            planning.
          </p>
        </div>

        <div className="fade-up rounded-[2rem] border border-black/8 bg-white/78 p-8 shadow-[0_24px_60px_rgba(21,35,33,0.08)] backdrop-blur sm:p-10">
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-black/45">
            Working Style
          </p>
          <div className="mt-6 grid gap-4">
            {workingStyle.map((point) => (
              <div
                key={point}
                className="rounded-[1.5rem] border border-black/8 bg-[#fcfaf6] p-5"
              >
                <p className="text-sm leading-7 text-[#152321]">{point}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 pb-8 sm:px-10 lg:px-12">
        <div className="fade-up rounded-[2rem] border border-black/8 bg-white/78 p-8 shadow-[0_24px_60px_rgba(21,35,33,0.08)] backdrop-blur sm:p-10">
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-black/45">
            Education
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-[#152321]">
            {education.school}
          </h2>
          <p className="mt-3 text-lg font-medium text-[#1b5e59]">
            {education.credential}
          </p>
          <p className="mt-5 max-w-3xl text-base leading-8 text-black/68">
            {education.description}
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 pb-16 sm:px-10 lg:px-12 lg:pb-20">
        <div className="fade-up rounded-[2.25rem] border border-black/8 bg-white/72 p-8 shadow-[0_24px_60px_rgba(21,35,33,0.08)] backdrop-blur sm:p-10">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-black/45">
            What I Value
          </p>
          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {values.map((value) => (
              <article
                key={value.title}
                className="rounded-[1.75rem] border border-black/8 bg-[#fcfaf6] p-6"
              >
                <h2 className="text-xl font-semibold text-[#152321]">
                  {value.title}
                </h2>
                <p className="mt-4 text-sm leading-7 text-black/68">
                  {value.description}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/projects"
              className="inline-flex items-center justify-center rounded-full border border-[#152321]/15 bg-white px-5 py-3 text-sm font-semibold text-[#152321] transition hover:-translate-y-0.5"
            >
              View Projects
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full bg-[#152321] px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#0f1a18]"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
