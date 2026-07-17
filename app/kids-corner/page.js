import {
  Paintbrush,
  Send,
  Sparkles,
  UserCheck,
} from "lucide-react";
import KidsCornerActions from "./kids-corner-actions";
import KidsOfferGallery from "./kids-offer-gallery";

export const metadata = {
  title: "Kids Corner",
  description:
    "A playful Kids Corner for young designers to save private dashboard drafts, submit creative work for review, and share approved designs.",
  alternates: {
    canonical: "/kids-corner",
  },
  openGraph: {
    title: "Kids Corner | Glenn Luna",
    description:
      "A playful creative page for private dashboard drafts, supervised submissions, and approved kid-friendly designs.",
    url: "https://glennluna.bindaddy.ca/kids-corner",
  },
  twitter: {
    title: "Kids Corner | Glenn Luna",
    description:
      "Kid-friendly creative work with private drafts, supervised reviews, and approved public designs.",
  },
};

const galleryIdeas = [
  "Character card",
  "Birthday invite",
  "Menu board",
  "Game screen",
  "Sticker pack",
  "Room sign",
];

const dashboardSteps = [
  {
    Icon: UserCheck,
    text: "Sign in with a confirmed account and ask an admin to assign the KidCreator role.",
  },
  {
    Icon: Paintbrush,
    text: "Open the dashboard and save a design as a private draft.",
  },
  {
    Icon: Send,
    text: "Submit the design so a ParentReviewer or admin can approve it before anything is published.",
  },
];

export default function KidsCornerPage() {
  return (
    <main className="relative isolate overflow-hidden bg-[#fffdfa] text-[#152321]">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,_#f7f3ec_0%,_#fffdfa_42%,_#eef5f2_100%)]" />

      <section className="mx-auto grid min-h-[calc(100vh-5rem)] w-full max-w-7xl gap-10 px-6 py-16 sm:px-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:px-12">
        <div className="fade-up space-y-7">
          <div className="inline-flex items-center rounded-full border border-[#1b5e59]/18 bg-white/80 px-4 py-2 font-mono text-xs uppercase tracking-[0.24em] text-[#1b5e59] shadow-[0_12px_32px_rgba(21,35,33,0.07)]">
            Creative lab
          </div>
          <div className="space-y-5">
            <h1 className="max-w-4xl text-5xl font-semibold text-[#152321] sm:text-6xl lg:text-7xl">
              Kids Corner
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-black/68">
              A small creative space for young makers to plan posters, mini
              websites, logos, and other design ideas before they grow into
              real portfolio pieces.
            </p>
          </div>
          <KidsCornerActions />
        </div>

        <div className="fade-up relative min-h-[28rem] rounded-[2rem] border border-[#152321]/10 bg-white p-5 shadow-[0_24px_70px_rgba(21,35,33,0.12)]">
          <div className="grid h-full gap-4 sm:grid-cols-[0.8fr_1.2fr]">
            <div className="rounded-[1.5rem] bg-[#152321] p-5 text-white">
              <p className="font-mono text-xs uppercase tracking-[0.24em] text-white/55">
                Design board
              </p>
              <div className="mt-8 grid gap-3">
                <div className="h-24 rounded-2xl bg-[#dd8c36]" />
                <div className="h-16 rounded-2xl bg-[#f5d36f]" />
                <div className="h-20 rounded-2xl bg-[#1b5e59]" />
              </div>
            </div>
            <div className="grid gap-4">
              <div className="rounded-[1.5rem] bg-[#f7f2ea] p-5">
                <p className="font-mono text-xs uppercase tracking-[0.22em] text-black/40">
                  Today&apos;s idea
                </p>
                <h2 className="mt-3 text-2xl font-semibold">
                  Build a bright poster for a tiny club.
                </h2>
                <p className="mt-3 text-sm leading-6 text-black/60">
                  Name the club, choose a color mood, and add one thing people
                  can do when they join.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-[1.5rem] bg-[#e4eef7] p-4">
                  <p className="text-sm font-semibold">Color mood</p>
                  <div className="mt-4 flex gap-2">
                    <span className="h-8 w-8 rounded-full bg-[#375a9e]" />
                    <span className="h-8 w-8 rounded-full bg-[#f5d36f]" />
                    <span className="h-8 w-8 rounded-full bg-[#dd8c36]" />
                  </div>
                </div>
                <div className="rounded-[1.5rem] bg-[#edf4f1] p-4">
                  <p className="text-sm font-semibold">Shape set</p>
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    <span className="h-8 rounded-full bg-[#1b5e59]" />
                    <span className="h-8 rounded-lg bg-[#152321]" />
                    <span className="h-8 rounded-full bg-[#dd8c36]" />
                  </div>
                </div>
              </div>
              <div className="rounded-[1.5rem] border border-dashed border-[#152321]/18 bg-white p-4">
                <p className="text-sm leading-6 text-black/58">
                  Save the final design as an image, PDF, document, or link when
                  it is ready for review.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <KidsOfferGallery />

      <section className="bg-[#152321] text-white">
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-6 py-16 sm:px-10 lg:grid-cols-[0.85fr_1.15fr] lg:px-12">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-white/45">
              Future gallery
            </p>
            <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">
              A dashboard can become the private studio.
            </h2>
            <p className="mt-4 text-sm leading-7 text-white/68">
              Signed-in kid creators can now save private design drafts in the
              dashboard, upload files or links, and send each project into a
              supervised review queue before anything becomes public.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {galleryIdeas.map((idea) => (
              <div
                key={idea}
                className="flex items-center gap-3 rounded-[1.35rem] border border-white/10 bg-white/8 p-5"
              >
                <Sparkles aria-hidden="true" className="h-5 w-5 shrink-0 text-[#f5d36f]" strokeWidth={1.8} />
                <p className="font-semibold">{idea}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-8 px-6 py-16 sm:px-10 lg:grid-cols-[0.95fr_1.05fr] lg:px-12">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-[#1b5e59]">
            Submission path
          </p>
          <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">
            Keep uploads supervised until the gallery exists.
          </h2>
          <p className="mt-4 text-sm leading-7 text-black/62">
            The safest current flow keeps every submission private by default.
            A signed-in child with the KidCreator role can edit only their own
            work, while a ParentReviewer or admin handles approval and
            publishing.
          </p>
        </div>

        <ol className="grid gap-4">
          {dashboardSteps.map(({ Icon, text }, index) => (
            <li
              key={text}
              className="flex items-center gap-4 rounded-[1.5rem] border border-black/8 bg-white p-5 shadow-[0_14px_36px_rgba(21,35,33,0.05)]"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#dd8c36] font-semibold text-white">
                <Icon aria-hidden="true" className="h-5 w-5" strokeWidth={1.8} />
              </span>
              <span className="text-sm font-semibold text-[#152321]">{text}</span>
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}
