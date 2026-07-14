"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const AUTH_CHANGED_EVENT = "glennluna:auth-changed";

function useAuthenticatedSession() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    let active = true;

    fetch("/api/auth/session", { cache: "no-store" })
      .then((response) =>
        response.ok ? response.json() : { authenticated: false },
      )
      .then((result) => {
        if (active) {
          setIsAuthenticated(Boolean(result.authenticated));
        }
      })
      .catch(() => {
        if (active) {
          setIsAuthenticated(false);
        }
      });

    function handleAuthChange(event) {
      setIsAuthenticated(Boolean(event.detail?.user));
    }

    window.addEventListener(AUTH_CHANGED_EVENT, handleAuthChange);
    return () => {
      active = false;
      window.removeEventListener(AUTH_CHANGED_EVENT, handleAuthChange);
    };
  }, []);

  return isAuthenticated;
}

export function AuthenticatedDashboardButton({ className, children }) {
  const isAuthenticated = useAuthenticatedSession();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Link href="/dashboard" className={className}>
      {children}
    </Link>
  );
}

export default function KidsCornerActions() {
  return (
    <div className="mt-7 flex flex-col gap-3 sm:flex-row">
      <Link
        href="#prompts"
        className="inline-flex items-center justify-center rounded-full bg-[#152321] px-6 py-3 text-sm font-semibold text-white shadow-[0_14px_34px_rgba(21,35,33,0.16)] transition hover:-translate-y-0.5 hover:bg-[#0f1a18]"
      >
        Start A Prompt
      </Link>
      <AuthenticatedDashboardButton className="inline-flex items-center justify-center rounded-full border border-[#152321]/15 bg-white/76 px-6 py-3 text-sm font-semibold text-[#152321] transition hover:-translate-y-0.5 hover:bg-white">
        Open Dashboard
      </AuthenticatedDashboardButton>
      <Link
        href="#offers"
        className="inline-flex items-center justify-center rounded-full border border-[#152321]/15 bg-white/76 px-6 py-3 text-sm font-semibold text-[#152321] transition hover:-translate-y-0.5 hover:bg-white"
      >
        Make An Offer
      </Link>
    </div>
  );
}
