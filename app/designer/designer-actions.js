"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function DesignerActions({ quoteHref }) {
  const [canUpdateGraphics, setCanUpdateGraphics] = useState(false);

  useEffect(() => {
    let active = true;

    fetch("/api/auth/session", { cache: "no-store" })
      .then((response) =>
        response.ok ? response.json() : { authenticated: false },
      )
      .then((result) => {
        if (active) {
          setCanUpdateGraphics(
            Boolean(result.authenticated && result.user?.role === "Graphic Designer"),
          );
        }
      })
      .catch(() => {
        if (active) {
          setCanUpdateGraphics(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="mt-7 flex flex-col gap-3 sm:flex-row">
      <Link
        href={quoteHref}
        className="inline-flex items-center justify-center rounded-full bg-[#152321] px-6 py-3 text-sm font-semibold text-white shadow-[0_14px_34px_rgba(21,35,33,0.16)] transition hover:-translate-y-0.5 hover:bg-[#0f1a18]"
      >
        Request Design Quote
      </Link>
      {canUpdateGraphics && (
        <Link
          href="/dashboard"
          className="inline-flex items-center justify-center rounded-full border border-[#152321]/15 bg-white px-6 py-3 text-sm font-semibold text-[#152321] transition hover:-translate-y-0.5 hover:bg-[#f7f2ea]"
        >
          Update Graphics
        </Link>
      )}
    </div>
  );
}
