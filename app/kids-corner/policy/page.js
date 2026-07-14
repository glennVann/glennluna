import Link from "next/link";

export const metadata = {
  title: "Kids Corner Policy",
  description:
    "Plain-language Kids Corner policy for design submissions, buyer offers, parent review, privacy, and safety.",
  alternates: {
    canonical: "/kids-corner/policy",
  },
  openGraph: {
    title: "Kids Corner Policy | Glenn Luna",
    description:
      "How Kids Corner submissions, published designs, and buyer offers are handled with adult review.",
    url: "https://glennluna.bindaddy.ca/kids-corner/policy",
  },
  twitter: {
    title: "Kids Corner Policy | Glenn Luna",
    description:
      "A plain-language policy for Kids Corner design submissions and buyer offers.",
  },
};

const policySections = [
  {
    title: "The short version",
    body:
      "Kids Corner is a supervised creative space. Kids can make and submit designs, but adults review what gets published, what can be listed for sale, and what happens when a buyer makes an offer.",
  },
  {
    title: "Who can see the work",
    body:
      "Drafts and submitted designs stay private inside the dashboard. A design only appears publicly after a ParentReviewer or admin approves and publishes it. If a design is not published, it is not meant to be shown to visitors or buyers.",
  },
  {
    title: "Offers and messages",
    body:
      "Buyers can send an offer for a published design that has been marked for sale. That message goes to the reviewer/admin queue. Buyers do not get a direct chat with the kid creator through this site.",
  },
  {
    title: "Money and delivery",
    body:
      "An offer is not an automatic sale. A parent reviewer or admin must review it first. Payment, delivery, refunds, and any final agreement are handled by the adult responsible for the listing.",
  },
  {
    title: "Kid privacy",
    body:
      "Kids should not post personal contact details, school names, addresses, phone numbers, or private family information in a design description or file. If something looks too personal, it can be edited, rejected, or removed.",
  },
  {
    title: "What may be removed",
    body:
      "Designs or offers may be removed if they are unsafe, too personal, copied from someone else without permission, hateful, sexual, threatening, spammy, or just not a good fit for a child-friendly space.",
  },
  {
    title: "Parent and admin control",
    body:
      "Parent reviewers and admins can approve, publish, unpublish, list work for offers, change offer status, and decline buyer requests. Their job is to keep the creative side fun while keeping the business side careful.",
  },
];

export default function KidsCornerPolicyPage() {
  return (
    <main className="bg-[#fffdfa] text-[#152321]">
      <section className="mx-auto w-full max-w-4xl px-6 py-20 sm:px-10 lg:px-12">
        <p className="font-mono text-xs uppercase tracking-[0.24em] text-[#1b5e59]">
          Kids Corner
        </p>
        <h1 className="mt-4 text-4xl font-semibold sm:text-5xl">
          Policy for kids&apos; designs and offers
        </h1>
        <p className="mt-5 text-lg leading-8 text-black/64">
          This page explains how Kids Corner works in normal words. It is here
          so kids, parents, and buyers understand the same basic rules before
          anyone uploads work or sends an offer.
        </p>

        <div className="mt-10 grid gap-5">
          {policySections.map((section) => (
            <article
              key={section.title}
              className="rounded-[1.5rem] border border-black/8 bg-white p-6 shadow-[0_14px_36px_rgba(21,35,33,0.05)]"
            >
              <h2 className="text-2xl font-semibold">{section.title}</h2>
              <p className="mt-3 text-sm leading-7 text-black/64">
                {section.body}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-10 rounded-[1.5rem] bg-[#152321] p-6 text-white">
          <h2 className="text-2xl font-semibold">A final note</h2>
          <p className="mt-3 text-sm leading-7 text-white/70">
            This is a small creative program, not a big marketplace. If
            something feels unclear, the adult reviewer should pause the offer
            or listing until everyone understands what is being shared, sold,
            and delivered.
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/kids-corner"
              className="inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#152321]"
            >
              Back to Kids Corner
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center rounded-full border border-white/16 px-5 py-3 text-sm font-semibold text-white"
            >
              Open Dashboard
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
