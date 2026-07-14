import Image from "next/image";
import Link from "next/link";
import DesignerActions from "./designer-actions";

export const metadata = {
  title: "Graphic Design Services",
  description:
    "Request graphic design work from Glenn Luna for logos, brand assets, social media graphics, website visuals, and digital design updates.",
  alternates: {
    canonical: "/designer",
  },
  openGraph: {
    title: "Graphic Design Services | Glenn Luna",
    description:
      "Design support for logos, refreshed graphics, social posts, website visuals, and brand assets.",
    url: "https://glennluna.bindaddy.ca/designer",
  },
  twitter: {
    title: "Graphic Design Services | Glenn Luna",
    description:
      "Request design work or update existing graphics through Glenn Luna.",
  },
};

const quoteHref =
  "/quote?projectType=Graphic%20Design&services=Graphic%20Design,Logo%20Refresh,Brand%20Assets";

const designServices = [
  {
    title: "Logo and brand refresh",
    text: "Clean up an existing logo, tighten the colors, or create matching assets so the brand feels more consistent.",
  },
  {
    title: "Social media graphics",
    text: "Post templates, launch graphics, profile banners, simple campaign visuals, and reusable layouts.",
  },
  {
    title: "Digital brand assets",
    text: "Reusable graphics for profiles, banners, thumbnails, simple campaigns, and online brand consistency.",
  },
  {
    title: "Website graphics",
    text: "Hero images, service graphics, project visuals, Open Graph images, and polished page assets.",
  },
];

const updateSteps = [
  "Upload the current graphic, notes, or design link in the dashboard.",
  "Explain what needs to change: text, colors, logo, size, file type, or layout.",
  "Submit the updated request so the final asset can be reviewed and delivered.",
];

export default function DesignerPage() {
  return (
    <main className="bg-[#fffdfa] text-[#152321]">
      <section className="mx-auto grid w-full max-w-7xl gap-10 px-6 py-16 sm:px-10 lg:grid-cols-[0.88fr_1.12fr] lg:items-center lg:px-12">
        <div className="fade-up">
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-[#1b5e59]">
            Designer
          </p>
          <h1 className="mt-4 max-w-3xl text-5xl font-semibold sm:text-6xl">
            Update your graphics or request new design work.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-black/66">
            Bring an old logo, social graphic, website image, or digital brand
            asset. I can help clean it up, rebuild it for the right format, or
            shape a new design from scratch.
          </p>
          <DesignerActions quoteHref={quoteHref} />
        </div>

        <div className="fade-up rounded-[2rem] border border-black/8 bg-white p-5 shadow-[0_24px_70px_rgba(21,35,33,0.1)]">
          <div className="grid gap-4 sm:grid-cols-[0.82fr_1.18fr]">
            <div className="rounded-[1.5rem] bg-[#152321] p-5 text-white">
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-white/48">
                Brand kit
              </p>
              <div className="mt-8 flex items-center gap-4">
                <div className="overflow-hidden rounded-2xl border border-white/12 bg-white">
                  <Image
                    src="/glenn-luna-logo.png"
                    alt="Glenn Luna logo preview"
                    width={84}
                    height={84}
                    className="h-[84px] w-[84px] object-cover"
                    priority
                  />
                </div>
                <div>
                  <p className="text-xl font-semibold">Logo</p>
                  <p className="mt-1 text-sm text-white/58">Clean, export, resize</p>
                </div>
              </div>
              <div className="mt-8 grid grid-cols-4 gap-2">
                <span className="h-10 rounded-xl bg-[#1b5e59]" />
                <span className="h-10 rounded-xl bg-[#dd8c36]" />
                <span className="h-10 rounded-xl bg-[#f5d36f]" />
                <span className="h-10 rounded-xl bg-white" />
              </div>
            </div>

            <div className="grid gap-4">
              <div className="rounded-[1.5rem] bg-[#f7f2ea] p-5">
                <p className="font-mono text-xs uppercase tracking-[0.22em] text-black/40">
                  Common updates
                </p>
                <h2 className="mt-3 text-2xl font-semibold">
                  Text changes, color refresh, file cleanup, export sizes.
                </h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1.5rem] bg-[#e4eef7] p-5">
                  <p className="text-sm font-semibold">Digital</p>
                  <p className="mt-2 text-sm leading-6 text-black/58">
                    Web graphics, banners, social posts, profile images.
                  </p>
                </div>
                <div className="rounded-[1.5rem] bg-[#edf4f1] p-5">
                  <p className="text-sm font-semibold">Brand assets</p>
                  <p className="mt-2 text-sm leading-6 text-black/58">
                    Logo files, profile images, thumbnails, and reusable visual pieces.
                  </p>
                </div>
              </div>
              <div className="rounded-[1.5rem] border border-dashed border-[#152321]/18 bg-white p-5">
                <p className="text-sm leading-6 text-black/58">
                  Send the file you have, even if it is rough. The first job is
                  to figure out what can be cleaned up and what should be
                  rebuilt.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 py-12 sm:px-10 lg:px-12">
        <div className="max-w-3xl">
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-[#1b5e59]">
            Design work
          </p>
          <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">
            A practical design page for real business graphics.
          </h2>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-4">
          {designServices.map((service) => (
            <article
              key={service.title}
              className="rounded-[1.5rem] border border-black/8 bg-white p-6 shadow-[0_14px_36px_rgba(21,35,33,0.05)]"
            >
              <h3 className="text-xl font-semibold">{service.title}</h3>
              <p className="mt-3 text-sm leading-7 text-black/62">
                {service.text}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-[#152321] text-white">
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-6 py-16 sm:px-10 lg:grid-cols-[0.9fr_1.1fr] lg:px-12">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-white/45">
              Graphic updates
            </p>
            <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">
              Designers can update graphics from the dashboard.
            </h2>
            <p className="mt-4 text-sm leading-7 text-white/68">
              If a designer or worker account is assigned a design task, they
              can submit updated files, links, and notes from the dashboard.
              Admins can review the work before it is used on the site or sent
              to a client.
            </p>
          </div>

          <ol className="grid gap-4">
            {updateSteps.map((step, index) => (
              <li
                key={step}
                className="flex items-center gap-4 rounded-[1.5rem] border border-white/10 bg-white/8 p-5"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#dd8c36] font-semibold text-white">
                  {index + 1}
                </span>
                <span className="text-sm font-semibold text-white/84">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-6 py-16 sm:px-10 lg:flex-row lg:items-center lg:justify-between lg:px-12">
        <div className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-[#1b5e59]">
            Start here
          </p>
          <h2 className="mt-3 text-3xl font-semibold">
            Need a design quote?
          </h2>
          <p className="mt-3 text-sm leading-7 text-black/62">
            Tell me what graphic you need, where it will be used, the file size
            or platform, and whether you already have a logo or brand colors.
          </p>
        </div>
        <Link
          href={quoteHref}
          className="inline-flex items-center justify-center rounded-full bg-[#152321] px-6 py-3 text-sm font-semibold text-white shadow-[0_14px_34px_rgba(21,35,33,0.16)] transition hover:-translate-y-0.5 hover:bg-[#0f1a18]"
        >
          Request Quote For Design Work
        </Link>
      </section>
    </main>
  );
}
