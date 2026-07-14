import QuoteForm from "./quote-form";

export const metadata = {
  title: "Project Quote",
  description:
    "Request a project quote from Glenn Luna for websites, web apps, graphic design, platforms, and custom software work.",
  alternates: {
    canonical: "/quote",
  },
  openGraph: {
    title: "Project Quote | Glenn Luna",
    description:
      "Request a quote for websites, dashboards, design work, POS systems, infrastructure setup, and custom software development.",
    url: "https://glennluna.bindaddy.ca/quote",
  },
  twitter: {
    title: "Project Quote | Glenn Luna",
    description:
      "Start a quote for custom software, websites, graphic design, server setup, and networking work.",
  },
};

function readParam(value) {
  return typeof value === "string" ? value : "";
}

function readServices(value) {
  if (Array.isArray(value)) return value.flatMap((item) => item.split(","));
  if (typeof value === "string") return value.split(",");
  return [];
}

export default async function QuotePage({ searchParams }) {
  const params = await searchParams;
  const initialProjectType = readParam(params?.projectType);
  const initialServices = readServices(params?.services);

  return (
    <main className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(27,94,89,0.18),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(221,140,54,0.16),_transparent_24%),linear-gradient(180deg,_#f7f3ec_0%,_#fffdfa_48%,_#f4efe6_100%)]" />

      <section className="mx-auto w-full max-w-7xl px-6 py-8 sm:px-10 lg:px-12">
        <div className="fade-up flex flex-col gap-6 border-b border-black/8 pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-black/45">
              Request A Quote
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-[#152321] sm:text-5xl lg:text-6xl">
              Tell me about your project and I&apos;ll help shape the next step.
            </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-black/68">
            Use this form if you want help with a website, internal tool, POS
            system, dashboard, graphic design, infrastructure setup, or a
            custom platform. The more context you share, the easier it is for
            me to give you a useful next step.
          </p>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 py-10 pb-16 sm:px-10 lg:px-12 lg:pb-20">
        <div className="grid gap-6 lg:grid-cols-[0.72fr_1.28fr]">
          <aside className="fade-up rounded-[2rem] border border-black/8 bg-[#152321] p-8 text-white shadow-[0_24px_60px_rgba(21,35,33,0.18)]">
            <p className="font-mono text-xs uppercase tracking-[0.26em] text-white/50">
              What To Include
            </p>
            <div className="mt-6 space-y-5">
              <div className="rounded-[1.5rem] border border-white/10 bg-white/6 p-5">
                <h2 className="text-lg font-semibold">Project Scope</h2>
                <p className="mt-2 text-sm leading-7 text-white/74">
                  Website redesign, dashboard, booking system, POS workflow,
                  graphic design, internal tool, or full custom platform.
                </p>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-white/6 p-5">
                <h2 className="text-lg font-semibold">Design Files</h2>
                <p className="mt-2 text-sm leading-7 text-white/74">
                  For graphics work, include the current file, brand colors,
                  target size, platform, and where the design will be used.
                </p>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-white/6 p-5">
                <h2 className="text-lg font-semibold">Timeline & Budget</h2>
                <p className="mt-2 text-sm leading-7 text-white/74">
                  A realistic launch target and budget range helps shape the
                  best technical approach.
                </p>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-white/6 p-5">
                <h2 className="text-lg font-semibold">Core Features</h2>
                <p className="mt-2 text-sm leading-7 text-white/74">
                  Share the most important workflows, pages, or integrations you
                  need first.
                </p>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-white/6 p-5">
                <h2 className="text-lg font-semibold">Infrastructure Needs</h2>
                <p className="mt-2 text-sm leading-7 text-white/74">
                  Include server setup, networking, file server requirements,
                  DNS, deployment, and storage workflow needs if they are part
                  of the project.
                </p>
              </div>
            </div>
          </aside>

          <QuoteForm
            initialProjectType={initialProjectType}
            initialServices={initialServices}
          />
        </div>
      </section>
    </main>
  );
}
