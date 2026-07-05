"use client";

import Link from "next/link";
import Script from "next/script";
import { useCallback, useEffect, useRef, useState } from "react";

const initialForm = {
  name: "",
  email: "",
  company: "",
  projectType: "Website",
  timeline: "",
  budget: "",
  details: "",
  infrastructureNotes: "",
};

const projectTypes = [
  "Website",
  "Dashboard",
  "POS System",
  "Booking Platform",
  "Internal Tool",
  "Full Custom App",
  "Infrastructure Setup",
];

const serviceOptions = [
  "Website Development",
  "Custom Web App",
  "POS System",
  "Server Setup",
  "Networking Setup",
  "File Server Setup",
];

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

export default function QuoteForm() {
  const [form, setForm] = useState(initialForm);
  const [selectedServices, setSelectedServices] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [submitState, setSubmitState] = useState({
    type: "",
    message: "",
  });
  const widgetRef = useRef(null);
  const widgetIdRef = useRef(null);

  const renderTurnstileWidget = useCallback(() => {
    if (
      !turnstileSiteKey ||
      typeof window === "undefined" ||
      !window.turnstile ||
      !widgetRef.current ||
      widgetIdRef.current !== null
    ) {
      return;
    }

    widgetIdRef.current = window.turnstile.render(widgetRef.current, {
      sitekey: turnstileSiteKey,
      theme: "light",
      callback(token) {
        setTurnstileToken(token);
        setSubmitState((current) =>
          current.type === "error"
            ? { type: "", message: "" }
            : current,
        );
      },
      "expired-callback"() {
        setTurnstileToken("");
      },
      "error-callback"() {
        setTurnstileToken("");
        setSubmitState({
          type: "error",
          message:
            "Verification could not be completed. Refresh the page and try again.",
        });
      },
    });
  }, []);

  useEffect(() => {
    renderTurnstileWidget();
  }, [renderTurnstileWidget]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function handleServiceToggle(event) {
    const { value, checked } = event.target;

    setSelectedServices((current) =>
      checked ? [...current, value] : current.filter((item) => item !== value),
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!turnstileSiteKey) {
      setSubmitState({
        type: "error",
        message:
          "Turnstile is not configured yet. Add the site key before accepting quote requests.",
      });
      return;
    }

    if (!turnstileToken) {
      setSubmitState({
        type: "error",
        message: "Please complete the verification before sending your request.",
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitState({ type: "", message: "" });

    try {
      const response = await fetch("/api/quote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          services: selectedServices,
          turnstileToken,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to send quote request.");
      }

      setSubmitState({
        type: "success",
        message:
          "Quote request sent successfully. I will review it and follow up soon.",
      });
      setForm(initialForm);
      setSelectedServices([]);
      resetTurnstile(widgetIdRef, setTurnstileToken);
    } catch (error) {
      setSubmitState({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Unable to send quote request.",
      });
      resetTurnstile(widgetIdRef, setTurnstileToken);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fade-up rounded-[2rem] border border-black/8 bg-white/78 p-8 shadow-[0_24px_60px_rgba(21,35,33,0.08)] backdrop-blur sm:p-10">
      {turnstileSiteKey ? (
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
          strategy="afterInteractive"
          onLoad={renderTurnstileWidget}
        />
      ) : null}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-black/45">
            Quote Form
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[#152321]">
            Project inquiry details
          </h2>
        </div>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-full border border-[#152321]/15 bg-[#fcfaf6] px-5 py-3 text-sm font-semibold text-[#152321] transition hover:-translate-y-0.5"
        >
          Back to Home
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 grid gap-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="grid gap-2 text-sm font-medium text-[#152321]">
            Full Name
            <input
              required
              name="name"
              value={form.name}
              onChange={handleChange}
              className="rounded-2xl border border-black/10 bg-[#fffdf8] px-4 py-3 text-sm outline-none transition focus:border-[#1b5e59]/40 focus:ring-4 focus:ring-[#1b5e59]/10"
              placeholder="Your name"
            />
          </label>

          <label className="grid gap-2 text-sm font-medium text-[#152321]">
            Email Address
            <input
              required
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="rounded-2xl border border-black/10 bg-[#fffdf8] px-4 py-3 text-sm outline-none transition focus:border-[#1b5e59]/40 focus:ring-4 focus:ring-[#1b5e59]/10"
              placeholder="you@example.com"
            />
          </label>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="grid gap-2 text-sm font-medium text-[#152321]">
            Company or Brand
            <input
              name="company"
              value={form.company}
              onChange={handleChange}
              className="rounded-2xl border border-black/10 bg-[#fffdf8] px-4 py-3 text-sm outline-none transition focus:border-[#1b5e59]/40 focus:ring-4 focus:ring-[#1b5e59]/10"
              placeholder="Company name"
            />
          </label>

          <label className="grid gap-2 text-sm font-medium text-[#152321]">
            Project Type
            <select
              name="projectType"
              value={form.projectType}
              onChange={handleChange}
              className="rounded-2xl border border-black/10 bg-[#fffdf8] px-4 py-3 text-sm outline-none transition focus:border-[#1b5e59]/40 focus:ring-4 focus:ring-[#1b5e59]/10"
            >
              {projectTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="grid gap-2 text-sm font-medium text-[#152321]">
            Timeline
            <input
              name="timeline"
              value={form.timeline}
              onChange={handleChange}
              className="rounded-2xl border border-black/10 bg-[#fffdf8] px-4 py-3 text-sm outline-none transition focus:border-[#1b5e59]/40 focus:ring-4 focus:ring-[#1b5e59]/10"
              placeholder="Example: 4-6 weeks"
            />
          </label>

          <label className="grid gap-2 text-sm font-medium text-[#152321]">
            Budget Range
            <input
              name="budget"
              value={form.budget}
              onChange={handleChange}
              className="rounded-2xl border border-black/10 bg-[#fffdf8] px-4 py-3 text-sm outline-none transition focus:border-[#1b5e59]/40 focus:ring-4 focus:ring-[#1b5e59]/10"
              placeholder="Example: $2,000-$5,000"
            />
          </label>
        </div>

        <fieldset className="grid gap-3">
          <legend className="text-sm font-medium text-[#152321]">
            Services Needed
          </legend>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {serviceOptions.map((service) => (
              <label
                key={service}
                className="flex items-center gap-3 rounded-2xl border border-black/10 bg-[#fffdf8] px-4 py-3 text-sm text-[#152321]"
              >
                <input
                  type="checkbox"
                  value={service}
                  checked={selectedServices.includes(service)}
                  onChange={handleServiceToggle}
                  className="h-4 w-4 accent-[#1b5e59]"
                />
                <span>{service}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <label className="grid gap-2 text-sm font-medium text-[#152321]">
          Project Details
          <textarea
            required
            name="details"
            value={form.details}
            onChange={handleChange}
            rows={7}
            className="rounded-[1.5rem] border border-black/10 bg-[#fffdf8] px-4 py-4 text-sm outline-none transition focus:border-[#1b5e59]/40 focus:ring-4 focus:ring-[#1b5e59]/10"
            placeholder="Tell me what you want to build, what features matter most, and what success looks like."
          />
        </label>

        <label className="grid gap-2 text-sm font-medium text-[#152321]">
          Server, Networking, or File Server Notes
          <textarea
            name="infrastructureNotes"
            value={form.infrastructureNotes}
            onChange={handleChange}
            rows={5}
            className="rounded-[1.5rem] border border-black/10 bg-[#fffdf8] px-4 py-4 text-sm outline-none transition focus:border-[#1b5e59]/40 focus:ring-4 focus:ring-[#1b5e59]/10"
            placeholder="Example: VPS setup, domain and DNS routing, nginx reverse proxy, local network requirements, shared drive structure, NAS or Windows file server setup."
          />
        </label>

        <div className="grid gap-3 rounded-[1.5rem] border border-black/10 bg-[#fcfaf6] p-5">
          <p className="text-sm font-medium text-[#152321]">Verification</p>
          <div ref={widgetRef} className="min-h-16" />
          <p className="text-sm leading-7 text-black/60">
            Complete the Turnstile check before sending your quote request.
          </p>
          {!turnstileSiteKey ? (
            <p className="text-sm leading-7 text-[#b94a48]">
              Add `NEXT_PUBLIC_TURNSTILE_SITE_KEY` to enable quote form
              protection.
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-3 border-t border-black/8 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-xl">
            <p className="text-sm leading-7 text-black/60">
              This form sends your quote request directly to `info@bindaddy.ca`
              from the site using the server email configuration and Turnstile
              verification.
            </p>
            {submitState.message ? (
              <p
                className={`mt-2 text-sm leading-7 ${
                  submitState.type === "success"
                    ? "text-[#1b5e59]"
                    : "text-[#b94a48]"
                }`}
              >
                {submitState.message}
              </p>
            ) : null}
          </div>
          <button
            type="submit"
            disabled={isSubmitting || !turnstileSiteKey || !turnstileToken}
            className="inline-flex items-center justify-center rounded-full bg-[#152321] px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#0f1a18] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:bg-[#152321]"
          >
            {isSubmitting ? "Sending..." : "Send Quote Request"}
          </button>
        </div>
      </form>
    </div>
  );
}
