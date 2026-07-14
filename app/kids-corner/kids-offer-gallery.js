"use client";

import Script from "next/script";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "";

function resetTurnstile(widgetIdRef, setTurnstileToken) {
  setTurnstileToken("");

  if (
    typeof window !== "undefined" &&
    window.turnstile &&
    widgetIdRef.current !== null
  ) {
    window.turnstile.reset(widgetIdRef.current);
  }
}

function formatPrice(amount, currency) {
  if (!amount) return "Open to offers";
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: currency || "CAD",
  }).format(amount);
}

export default function KidsOfferGallery() {
  const widgetRef = useRef(null);
  const widgetIdRef = useRef(null);
  const [designs, setDesigns] = useState([]);
  const [selectedDesignId, setSelectedDesignId] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const renderTurnstileWidget = useCallback(() => {
    if (
      !turnstileSiteKey ||
      !widgetRef.current ||
      !window.turnstile ||
      widgetIdRef.current !== null
    ) {
      return;
    }

    widgetIdRef.current = window.turnstile.render(widgetRef.current, {
      sitekey: turnstileSiteKey,
      theme: "light",
      callback(token) {
        setTurnstileToken(token);
      },
      "expired-callback"() {
        setTurnstileToken("");
      },
      "error-callback"() {
        setTurnstileToken("");
      },
    });
  }, []);

  useEffect(() => {
    renderTurnstileWidget();
  }, [renderTurnstileWidget]);

  useEffect(() => {
    let mounted = true;

    async function loadDesigns() {
      try {
        const response = await fetch("/api/kids-corner/designs", {
          cache: "no-store",
        });
        const result = await response.json().catch(() => []);
        if (!response.ok) {
          throw new Error(result.error || "Unable to load designs.");
        }
        if (mounted) {
          setDesigns(result);
          setSelectedDesignId(result[0]?.id ? String(result[0].id) : "");
        }
      } catch (loadError) {
        if (mounted) setError(loadError.message);
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    loadDesigns();
    return () => {
      mounted = false;
    };
  }, []);

  async function submitOffer(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setError("");
    setMessage("");

    if (!turnstileSiteKey) {
      setError("Offer verification is not configured yet.");
      return;
    }

    if (!turnstileToken) {
      setError("Complete the verification check before sending your offer.");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch("/api/kids-corner/offers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          designId: Number(data.get("designId")),
          buyerName: data.get("buyerName"),
          buyerEmail: data.get("buyerEmail"),
          offerAmount: Number(data.get("offerAmount")),
          currency: data.get("currency"),
          message: data.get("message"),
          turnstileToken,
        }),
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.error || "Unable to send offer.");
      }

      form.reset();
      setSelectedDesignId(designs[0]?.id ? String(designs[0].id) : "");
      setMessage("Offer sent. A parent reviewer or admin will review it before any next step.");
      resetTurnstile(widgetIdRef, setTurnstileToken);
    } catch (submitError) {
      setError(submitError.message);
      resetTurnstile(widgetIdRef, setTurnstileToken);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <section className="mx-auto w-full max-w-7xl px-6 py-16 sm:px-10 lg:px-12">
        <p className="rounded-[1.5rem] border border-black/8 bg-white p-6 text-sm text-black/55">
          Loading published designs...
        </p>
      </section>
    );
  }

  return (
    <section id="offers" className="mx-auto w-full max-w-7xl px-6 py-16 sm:px-10 lg:px-12">
      {turnstileSiteKey ? (
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
          strategy="afterInteractive"
          onLoad={renderTurnstileWidget}
        />
      ) : null}

      <div className="grid gap-8 lg:grid-cols-[1fr_0.78fr]">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-[#1b5e59]">
            Published for sale
          </p>
          <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">
            Make an offer on approved work.
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-black/62">
            Offers go to an adult reviewer first. Buyer details are not shared
            directly with a kid creator. Please read the{" "}
            <Link href="/kids-corner/policy" className="font-semibold text-[#1b5e59] underline">
              Kids Corner policy
            </Link>{" "}
            before sending an offer.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {designs.map((design) => (
              <button
                key={design.id}
                type="button"
                onClick={() => setSelectedDesignId(String(design.id))}
                className={
                  "rounded-[1.5rem] border p-5 text-left shadow-[0_14px_36px_rgba(21,35,33,0.06)] transition hover:-translate-y-0.5 " +
                  (selectedDesignId === String(design.id)
                    ? "border-[#1b5e59] bg-[#edf4f1]"
                    : "border-black/8 bg-white")
                }
              >
                <h3 className="text-xl font-semibold">{design.title}</h3>
                <p className="mt-3 line-clamp-4 text-sm leading-6 text-black/62">
                  {design.description || "Published Kids Corner design."}
                </p>
                <p className="mt-4 text-sm font-semibold text-[#1b5e59]">
                  Asking {formatPrice(design.askingPrice, design.saleCurrency)}
                </p>
              </button>
            ))}

            {designs.length === 0 && (
              <p className="rounded-[1.5rem] border border-dashed border-black/12 bg-white/70 px-4 py-8 text-center text-sm text-black/45 md:col-span-2">
                No designs are listed for offers yet.
              </p>
            )}
          </div>
        </div>

        <form
          onSubmit={submitOffer}
          className="rounded-[1.5rem] border border-black/8 bg-white p-6 shadow-[0_18px_46px_rgba(21,35,33,0.08)]"
        >
          <h3 className="text-2xl font-semibold">Offer details</h3>
          <p className="mt-2 text-sm leading-6 text-black/58">
            This is a request, not an instant purchase. A parent reviewer or
            admin handles the reply.
          </p>

          {error && (
            <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700" role="alert">
              {error}
            </p>
          )}
          {message && (
            <p className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800" aria-live="polite">
              {message}
            </p>
          )}

          <label className="mt-5 block text-sm font-semibold" htmlFor="offer-design">
            Design
          </label>
          <select
            id="offer-design"
            name="designId"
            required
            value={selectedDesignId}
            onChange={(event) => setSelectedDesignId(event.target.value)}
            disabled={designs.length === 0}
            className="mt-2 w-full rounded-xl border border-black/10 bg-white p-3 disabled:opacity-60"
          >
            {designs.map((design) => (
              <option key={design.id} value={design.id}>
                {design.title}
              </option>
            ))}
          </select>

          <label className="mt-4 block text-sm font-semibold" htmlFor="offer-name">
            Your name
          </label>
          <input
            id="offer-name"
            name="buyerName"
            required
            maxLength={100}
            className="mt-2 w-full rounded-xl border border-black/10 bg-white p-3"
          />

          <label className="mt-4 block text-sm font-semibold" htmlFor="offer-email">
            Email
          </label>
          <input
            id="offer-email"
            name="buyerEmail"
            type="email"
            required
            maxLength={256}
            className="mt-2 w-full rounded-xl border border-black/10 bg-white p-3"
          />

          <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_0.55fr]">
            <div>
              <label className="block text-sm font-semibold" htmlFor="offer-amount">
                Offer amount
              </label>
              <input
                id="offer-amount"
                name="offerAmount"
                type="number"
                min="0.01"
                max="10000"
                step="0.01"
                required
                className="mt-2 w-full rounded-xl border border-black/10 bg-white p-3"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold" htmlFor="offer-currency">
                Currency
              </label>
              <select
                id="offer-currency"
                name="currency"
                defaultValue="CAD"
                className="mt-2 w-full rounded-xl border border-black/10 bg-white p-3"
              >
                <option>CAD</option>
                <option>USD</option>
              </select>
            </div>
          </div>

          <label className="mt-4 block text-sm font-semibold" htmlFor="offer-message">
            Message for the reviewer
          </label>
          <textarea
            id="offer-message"
            name="message"
            maxLength={1200}
            placeholder="Share what you would like to buy and any delivery questions."
            className="mt-2 min-h-28 w-full rounded-xl border border-black/10 bg-white p-3"
          />

          <div className="mt-5 min-h-[65px]">
            {turnstileSiteKey ? (
              <div ref={widgetRef} />
            ) : (
              <p className="rounded-xl bg-amber-50 p-3 text-sm text-amber-800">
                Add NEXT_PUBLIC_TURNSTILE_SITE_KEY to enable offer submissions.
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={
              designs.length === 0 ||
              isSubmitting ||
              !turnstileSiteKey ||
              !turnstileToken
            }
            className="mt-4 w-full rounded-full bg-[#152321] px-6 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Sending offer..." : "Send offer for review"}
          </button>
        </form>
      </div>
    </section>
  );
}
