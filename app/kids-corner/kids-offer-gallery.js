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

function removeTurnstile(widgetIdRef) {
  if (
    typeof window !== "undefined" &&
    window.turnstile &&
    typeof window.turnstile.remove === "function" &&
    widgetIdRef.current !== null
  ) {
    window.turnstile.remove(widgetIdRef.current);
  }

  widgetIdRef.current = null;
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
          setSelectedDesignId("");
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

  useEffect(() => {
    if (!selectedDesignId) return undefined;

    removeTurnstile(widgetIdRef);

    const renderTimer = window.setTimeout(renderTurnstileWidget, 0);
    return () => window.clearTimeout(renderTimer);
  }, [renderTurnstileWidget, selectedDesignId]);

  function openOfferForm(designId) {
    const nextDesignId = String(designId);
    setError("");
    setMessage("");
    setTurnstileToken("");
    setSelectedDesignId((current) =>
      current === nextDesignId ? "" : nextDesignId,
    );
  }

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

      <div>
        <p className="font-mono text-xs uppercase tracking-[0.24em] text-[#1b5e59]">
          Published for sale
        </p>
        <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">
          Make an offer on approved work.
        </h2>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-black/62">
          Offers go to an adult reviewer first. Buyer details are not shared
          directly with a kid creator. Please read the{" "}
          <Link href="/kids-corner/policy" className="font-semibold text-[#1b5e59] underline">
            Kids Corner policy
          </Link>{" "}
          before sending an offer.
        </p>

        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          {designs.map((design) => {
            const isSelected = selectedDesignId === String(design.id);

            return (
              <article
                key={design.id}
                className={
                  "rounded-[1.5rem] border bg-white p-5 shadow-[0_14px_36px_rgba(21,35,33,0.06)] transition " +
                  (isSelected ? "border-[#1b5e59]" : "border-black/8")
                }
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="text-xl font-semibold">{design.title}</h3>
                    <p className="mt-3 line-clamp-4 text-sm leading-6 text-black/62">
                      {design.description || "Published Kids Corner design."}
                    </p>
                    <p className="mt-4 text-sm font-semibold text-[#1b5e59]">
                      Asking {formatPrice(design.askingPrice, design.saleCurrency)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => openOfferForm(design.id)}
                    className="shrink-0 rounded-full bg-[#152321] px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#0f1a18]"
                  >
                    {isSelected ? "Close offer" : "Make an offer"}
                  </button>
                </div>

                {isSelected && (
                  <form
                    onSubmit={submitOffer}
                    className="mt-5 border-t border-black/10 pt-5"
                  >
                    <input type="hidden" name="designId" value={design.id} />
                    <h4 className="text-lg font-semibold">Offer details</h4>
                    <p className="mt-2 text-sm leading-6 text-black/58">
                      This request is attached to {design.title}. A parent
                      reviewer or admin handles the reply.
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

                    <label className="mt-5 block text-sm font-semibold" htmlFor={`offer-name-${design.id}`}>
                      Your name
                    </label>
                    <input
                      id={`offer-name-${design.id}`}
                      name="buyerName"
                      required
                      maxLength={100}
                      className="mt-2 w-full rounded-xl border border-black/10 bg-white p-3"
                    />

                    <label className="mt-4 block text-sm font-semibold" htmlFor={`offer-email-${design.id}`}>
                      Email
                    </label>
                    <input
                      id={`offer-email-${design.id}`}
                      name="buyerEmail"
                      type="email"
                      required
                      maxLength={256}
                      className="mt-2 w-full rounded-xl border border-black/10 bg-white p-3"
                    />

                    <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_0.55fr]">
                      <div>
                        <label className="block text-sm font-semibold" htmlFor={`offer-amount-${design.id}`}>
                          Offer amount
                        </label>
                        <input
                          id={`offer-amount-${design.id}`}
                          name="offerAmount"
                          type="number"
                          min="0.01"
                          max="10000"
                          step="0.01"
                          required
                          defaultValue={design.askingPrice || ""}
                          className="mt-2 w-full rounded-xl border border-black/10 bg-white p-3"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold" htmlFor={`offer-currency-${design.id}`}>
                          Currency
                        </label>
                        <select
                          id={`offer-currency-${design.id}`}
                          name="currency"
                          defaultValue={design.saleCurrency || "CAD"}
                          className="mt-2 w-full rounded-xl border border-black/10 bg-white p-3"
                        >
                          <option>CAD</option>
                          <option>USD</option>
                        </select>
                      </div>
                    </div>

                    <label className="mt-4 block text-sm font-semibold" htmlFor={`offer-message-${design.id}`}>
                      Message for the reviewer
                    </label>
                    <textarea
                      id={`offer-message-${design.id}`}
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
                        isSubmitting ||
                        !turnstileSiteKey ||
                        !turnstileToken
                      }
                      className="mt-4 w-full rounded-full bg-[#152321] px-6 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isSubmitting ? "Sending offer..." : "Send offer for review"}
                    </button>
                  </form>
                )}
              </article>
            );
          })}

          {designs.length === 0 && (
            <p className="rounded-[1.5rem] border border-dashed border-black/12 bg-white/70 px-4 py-8 text-center text-sm text-black/45 lg:col-span-2">
              No designs are listed for offers yet.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
