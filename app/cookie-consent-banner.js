"use client";

import { useEffect, useState } from "react";

const COOKIE_CONSENT_KEY = "glennluna-cookie-consent";

function shouldShowCookieBanner() {
  if (typeof window === "undefined") return false;
  return !window.localStorage.getItem(COOKIE_CONSENT_KEY);
}

export default function CookieConsentBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const onStorage = () => setIsVisible(shouldShowCookieBanner());
    const syncTimer = window.setTimeout(onStorage, 0);
    window.addEventListener("storage", onStorage);
    return () => {
      window.clearTimeout(syncTimer);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  function saveChoice(choice) {
    window.localStorage.setItem(COOKIE_CONSENT_KEY, choice);
    setIsVisible(false);
  }

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-4 z-50 px-4 sm:bottom-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-5 rounded-[2rem] border border-[#152321]/10 bg-white/92 p-6 shadow-[0_24px_70px_rgba(21,35,33,0.18)] backdrop-blur sm:flex-row sm:items-end sm:justify-between sm:p-7">
        <div className="max-w-3xl">
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-[#1b5e59]">
            Cookie Preferences
          </p>
          <p className="mt-3 text-sm leading-7 text-black/68 sm:text-base">
            This site uses cookies and local storage to remember your consent
            choice and support a smoother browsing experience. You can accept
            or decline optional cookie usage.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => saveChoice("declined")}
            className="inline-flex items-center justify-center rounded-full border border-[#152321]/12 bg-[#f7f3ec] px-5 py-3 text-sm font-semibold text-[#152321] transition hover:-translate-y-0.5 hover:bg-white"
          >
            Decline
          </button>
          <button
            type="button"
            onClick={() => saveChoice("accepted")}
            className="inline-flex items-center justify-center rounded-full bg-[#152321] px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#0f1a18]"
          >
            Accept Cookies
          </button>
        </div>
      </div>
    </div>
  );
}
