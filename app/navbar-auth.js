"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function NavbarAuth() {
  const dialogRef = useRef(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    let active = true;
    fetch("/api/auth/session", { cache: "no-store" })
      .then(async (response) => response.ok ? response.json() : { authenticated: false })
      .then((result) => {
        if (active && result.authenticated) setUser(result.user);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  async function handleLogin(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: formData.get("email"),
        password: formData.get("password"),
      }),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      setError(result.error || "Unable to sign in. Check your credentials and email confirmation.");
      setSubmitting(false);
      return;
    }
    setUser(result.user);
    setSubmitting(false);
    dialogRef.current?.close();
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setMenuOpen(false);
    setUser(null);
  }

  if (loading) {
    return <span className="h-10 w-16 animate-pulse rounded-full bg-black/8" aria-label="Checking login status" />;
  }

  if (user) {
    return (
      <div className="relative">
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          className="block overflow-hidden rounded-full border-2 border-white bg-[#07111f] shadow-[0_8px_22px_rgba(21,35,33,0.2)] ring-1 ring-[#152321]/15 hover:-translate-y-0.5"
          aria-label="Open account menu"
          aria-expanded={menuOpen}
        >
          <Image src="/glenn-luna-logo.png" alt="Account thumbnail" width={40} height={40} className="h-10 w-10 object-cover" />
        </button>
        {menuOpen && (
          <div className="absolute right-0 top-12 w-64 rounded-2xl border border-black/10 bg-white p-3 text-sm shadow-[0_18px_45px_rgba(21,35,33,0.18)]">
            <p className="truncate px-2 py-1 font-semibold text-[#152321]">{user.email}</p>
            <button type="button" onClick={handleLogout} className="mt-2 w-full rounded-xl bg-[#152321] px-3 py-2 font-semibold text-white hover:bg-[#0f1a18]">Log out</button>
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => { setError(""); dialogRef.current?.showModal(); }}
        className="rounded-full border border-[#152321]/18 bg-white px-4 py-2 text-sm font-semibold text-[#152321] hover:-translate-y-0.5 hover:bg-[#f4eee5]"
      >
        Login
      </button>
      <dialog
        ref={dialogRef}
        onClick={(event) => { if (event.target === dialogRef.current) dialogRef.current.close(); }}
        className="m-auto w-[min(92vw,26rem)] rounded-3xl border border-black/10 bg-[#fffdfa] p-0 text-[#152321] shadow-[0_30px_90px_rgba(21,35,33,0.28)] backdrop:bg-[#07111f]/55 backdrop:backdrop-blur-sm"
      >
        <form onSubmit={handleLogin} className="p-7 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-black/40">Account</p>
              <h2 className="mt-2 text-2xl font-semibold">Welcome back</h2>
            </div>
            <button type="button" onClick={() => dialogRef.current?.close()} className="rounded-full border border-black/10 px-3 py-1.5 text-sm hover:bg-black/5" aria-label="Close login form">Close</button>
          </div>
          <label className="mt-7 block text-sm font-semibold" htmlFor="login-email">Email</label>
          <input id="login-email" name="email" type="email" autoComplete="email" required className="mt-2 w-full rounded-2xl border border-black/12 bg-white px-4 py-3 outline-none focus:border-[#1b5e59] focus:ring-2 focus:ring-[#1b5e59]/15" />
          <label className="mt-4 block text-sm font-semibold" htmlFor="login-password">Password</label>
          <input id="login-password" name="password" type="password" autoComplete="current-password" required className="mt-2 w-full rounded-2xl border border-black/12 bg-white px-4 py-3 outline-none focus:border-[#1b5e59] focus:ring-2 focus:ring-[#1b5e59]/15" />
          {error && <p className="mt-4 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
          <button type="submit" disabled={submitting} className="mt-6 w-full rounded-2xl bg-[#152321] px-4 py-3 font-semibold text-white hover:bg-[#0f1a18] disabled:cursor-wait disabled:opacity-60">
            {submitting ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </dialog>
    </>
  );
}
