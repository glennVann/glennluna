import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  BadgeCheck,
  BriefcaseBusiness,
  CheckCircle2,
  Cpu,
  Sparkles,
} from "lucide-react";
import { getProjectBySlug, projects } from "../project-data";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  const canonicalPath = `/projects/${project.slug}`;

  return {
    title: `${project.name} Project`,
    description: project.seoDescription,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      title: `${project.name} Project | Glenn Luna`,
      description: project.seoDescription,
      url: `https://glennluna.bindaddy.ca${canonicalPath}`,
    },
    twitter: {
      title: `${project.name} Project | Glenn Luna`,
      description: project.seoDescription,
    },
  };
}

export default async function ProjectDetailPage({ params }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.name,
    description: project.seoDescription,
    url: `https://glennluna.bindaddy.ca/projects/${project.slug}`,
    author: {
      "@type": "Person",
      name: "Glenn Luna",
    },
    about: project.technologies,
  };

  return (
    <main className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(27,94,89,0.18),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(221,140,54,0.14),_transparent_26%),linear-gradient(180deg,_#f7f3ec_0%,_#fffdfa_52%,_#f4efe6_100%)]" />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <section className="mx-auto w-full max-w-7xl px-6 py-8 sm:px-10 lg:px-12">
        <header className="fade-up flex flex-col gap-6 border-b border-black/8 pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-black/45">
              Project Detail
            </p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#1b5e59]/15 bg-[#1b5e59]/8 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.24em] text-[#1b5e59]">
              <BadgeCheck aria-hidden="true" className="h-4 w-4" strokeWidth={1.8} />
              {project.status}
            </div>
            <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-[#152321] sm:text-5xl lg:text-6xl">
              {project.name}
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-black/68">
              {project.summary}
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/projects"
              className="inline-flex items-center justify-center rounded-full border border-[#152321]/15 bg-white px-5 py-3 text-sm font-semibold text-[#152321] shadow-[0_12px_28px_rgba(21,35,33,0.08)] transition hover:-translate-y-0.5"
            >
              <ArrowLeft aria-hidden="true" className="mr-2 h-4 w-4" strokeWidth={1.8} />
              Back to Projects
            </Link>
            <div className="inline-flex items-center justify-center gap-2 rounded-full bg-[#152321] px-5 py-3 text-sm font-semibold text-white">
              <BriefcaseBusiness aria-hidden="true" className="h-4 w-4" strokeWidth={1.8} />
              Portfolio Project
            </div>
          </div>
        </header>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-6 px-6 py-10 sm:px-10 lg:grid-cols-[1.1fr_0.9fr] lg:px-12">
        <div className="fade-up rounded-[2rem] border border-black/8 bg-white/78 p-8 shadow-[0_24px_60px_rgba(21,35,33,0.08)] backdrop-blur sm:p-10">
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-black/45">
            Project Overview
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-[#152321]">
            {project.category}
          </h2>
          <p className="mt-5 text-base leading-8 text-black/68">
            {project.seoDescription}
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {project.highlights.map((highlight) => (
              <div
                key={highlight}
                className="flex gap-3 rounded-[1.5rem] border border-black/8 bg-[#fcfaf6] p-5"
              >
                <CheckCircle2 aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-[#1b5e59]" strokeWidth={1.8} />
                <p className="text-sm leading-7 text-[#152321]">{highlight}</p>
              </div>
            ))}
          </div>
        </div>

        <aside className="fade-up rounded-[2rem] border border-black/8 bg-[#152321] p-8 text-white shadow-[0_24px_60px_rgba(21,35,33,0.18)]">
          <p className="font-mono text-xs uppercase tracking-[0.26em] text-white/50">
            Technologies
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {project.technologies.map((item) => (
              <span
                key={item}
                className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-sm font-medium text-white/85"
              >
                <Cpu aria-hidden="true" className="h-4 w-4 text-[#f5d36f]" strokeWidth={1.8} />
                {item}
              </span>
            ))}
          </div>
        </aside>
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 pb-16 sm:px-10 lg:px-12 lg:pb-20">
        <div className="fade-up rounded-[2.25rem] border border-black/8 bg-white/72 p-8 shadow-[0_24px_60px_rgba(21,35,33,0.08)] backdrop-blur sm:p-10">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-black/45">
            Key Features
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {project.features.map((feature) => (
              <div
                key={feature}
                className="flex gap-3 rounded-2xl border border-black/8 bg-[#fffdf8] px-5 py-5 text-sm leading-7 text-[#152321]"
              >
                <Sparkles aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-[#dd8c36]" strokeWidth={1.8} />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {project.architectureImage ? (
        <section className="mx-auto w-full max-w-7xl px-6 pb-16 sm:px-10 lg:px-12 lg:pb-20">
          <div className="fade-up rounded-[2.25rem] border border-black/8 bg-white/78 p-8 shadow-[0_24px_60px_rgba(21,35,33,0.08)] backdrop-blur sm:p-10">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-black/45">
              {project.architectureImage.title}
            </p>
            <p className="mt-4 max-w-3xl text-base leading-8 text-black/68">
              {project.architectureImage.caption}
            </p>
            <div className="mt-8 overflow-hidden rounded-[1.75rem] border border-black/8 bg-[#fffdf8] shadow-[0_20px_50px_rgba(21,35,33,0.08)]">
              <Image
                src={project.architectureImage.src}
                alt={project.architectureImage.alt}
                width={1536}
                height={1024}
                className="h-auto w-full object-cover"
              />
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
}
