"use client";

import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { useCallback, useEffect, useRef, useState } from "react";

const AUTH_CHANGED_EVENT = "glennluna:auth-changed";
const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "";
const authModeTitle = {
  login: "Welcome back",
  register: "Create account",
  forgot: "Reset password",
  reset: "Enter reset code",
};

function publishAuthChange(user) {
  window.dispatchEvent(new CustomEvent(AUTH_CHANGED_EVENT, { detail: { user } }));
}

function getInitials(value) {
  const name = (value || "User").split("@")[0];
  const parts = name.split(/[\s._-]+/).filter(Boolean);
  if (parts.length > 1) {
    return `${parts[0][0]}${parts.at(-1)[0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

function readImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Unable to read the selected photo."));
    reader.readAsDataURL(file);
  });
}

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

function removeTurnstile(widgetIdRef, setTurnstileToken) {
  setTurnstileToken("");

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

export default function NavbarAuth() {
  const dialogRef = useRef(null);
  const profileDialogRef = useRef(null);
  const turnstileRef = useRef(null);
  const turnstileWidgetIdRef = useRef(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [mode, setMode] = useState("login");
  const [message, setMessage] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [profilePreview, setProfilePreview] = useState("");
  const [profileError, setProfileError] = useState("");
  const [profileSaving, setProfileSaving] = useState(false);
  const [photoVersion, setPhotoVersion] = useState(0);
  const [turnstileToken, setTurnstileToken] = useState("");

  const renderTurnstileWidget = useCallback(() => {
    if (
      !turnstileSiteKey ||
      !turnstileRef.current ||
      !window.turnstile ||
      turnstileWidgetIdRef.current !== null
    ) {
      return;
    }

    turnstileWidgetIdRef.current = window.turnstile.render(turnstileRef.current, {
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
    let active = true;
    fetch("/api/auth/session", { cache: "no-store" })
      .then(async (response) => response.ok ? response.json() : { authenticated: false })
      .then((result) => {
        if (active && result.authenticated) {
          setUser(result.user);
          publishAuthChange(result.user);
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    renderTurnstileWidget();
  }, [mode, renderTurnstileWidget]);

  async function handleLogin(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    const formData = new FormData(event.currentTarget);
    if (!turnstileSiteKey) {
      setError("Verification is not configured yet.");
      setSubmitting(false);
      return;
    }
    if (!turnstileToken) {
      setError("Complete the verification check before signing in.");
      setSubmitting(false);
      return;
    }
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: formData.get("email"),
        password: formData.get("password"),
        turnstileToken,
      }),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      setError(result.error || "Unable to sign in. Check your credentials and email confirmation.");
      resetTurnstile(turnstileWidgetIdRef, setTurnstileToken);
      setSubmitting(false);
      return;
    }
    setUser(result.user);
    publishAuthChange(result.user);
    setSubmitting(false);
    removeTurnstile(turnstileWidgetIdRef, setTurnstileToken);
    dialogRef.current?.close();
  }

  async function handleRegister(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setMessage("");
    const formData = new FormData(event.currentTarget);
    const password = formData.get("password");
    if (!turnstileSiteKey) {
      setError("Verification is not configured yet.");
      setSubmitting(false);
      return;
    }
    if (!turnstileToken) {
      setError("Complete the verification check before creating an account.");
      setSubmitting(false);
      return;
    }
    if (password !== formData.get("confirmPassword")) {
      setError("Passwords do not match.");
      setSubmitting(false);
      return;
    }
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: formData.get("email"), password, turnstileToken }),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      setError(result.error || "Unable to create the account.");
      resetTurnstile(turnstileWidgetIdRef, setTurnstileToken);
      setSubmitting(false);
      return;
    }
    resetTurnstile(turnstileWidgetIdRef, setTurnstileToken);
    setMode("login");
    setMessage("Account created. Check your email and confirm your address before signing in.");
    setSubmitting(false);
  }

  async function handleForgotPassword(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setMessage("");
    const formData = new FormData(event.currentTarget);
    if (!turnstileSiteKey) {
      setError("Verification is not configured yet.");
      setSubmitting(false);
      return;
    }
    if (!turnstileToken) {
      setError("Complete the verification check before requesting a reset code.");
      setSubmitting(false);
      return;
    }

    const response = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: formData.get("email"),
        turnstileToken,
      }),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      setError(result.error || "Unable to send the reset code.");
      resetTurnstile(turnstileWidgetIdRef, setTurnstileToken);
      setSubmitting(false);
      return;
    }

    resetTurnstile(turnstileWidgetIdRef, setTurnstileToken);
    setMode("reset");
    setMessage("If that email is registered, a password reset code has been sent.");
    setSubmitting(false);
  }

  async function handleResetPassword(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setMessage("");
    const formData = new FormData(event.currentTarget);
    const password = formData.get("password");
    if (!turnstileSiteKey) {
      setError("Verification is not configured yet.");
      setSubmitting(false);
      return;
    }
    if (!turnstileToken) {
      setError("Complete the verification check before resetting your password.");
      setSubmitting(false);
      return;
    }
    if (password !== formData.get("confirmPassword")) {
      setError("Passwords do not match.");
      setSubmitting(false);
      return;
    }

    const response = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: formData.get("email"),
        resetCode: formData.get("resetCode"),
        newPassword: password,
        turnstileToken,
      }),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      setError(result.error || "Unable to reset the password.");
      resetTurnstile(turnstileWidgetIdRef, setTurnstileToken);
      setSubmitting(false);
      return;
    }

    resetTurnstile(turnstileWidgetIdRef, setTurnstileToken);
    setMode("login");
    setMessage("Password updated. You can sign in with the new password.");
    setSubmitting(false);
  }

  function handleAuthSubmit(event) {
    if (mode === "register") return handleRegister(event);
    if (mode === "forgot") return handleForgotPassword(event);
    if (mode === "reset") return handleResetPassword(event);
    return handleLogin(event);
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setMenuOpen(false);
    setUser(null);
    removeTurnstile(turnstileWidgetIdRef, setTurnstileToken);
    publishAuthChange(null);
  }

  function openProfile() {
    setMenuOpen(false);
    setProfileError("");
    setProfilePreview(user?.hasProfileImage ? `/api/auth/avatar?v=${photoVersion}` : "");
    profileDialogRef.current?.showModal();
  }

  async function handlePhotoChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setProfileError("Choose a JPEG, PNG, or WebP image.");
      event.target.value = "";
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setProfileError("Profile photo must be 2 MB or smaller.");
      event.target.value = "";
      return;
    }
    setProfileError("");
    setProfilePreview(await readImage(file));
  }

  async function handleProfileSave(event) {
    event.preventDefault();
    setProfileSaving(true);
    setProfileError("");
    const formData = new FormData(event.currentTarget);
    const file = formData.get("profilePhoto");
    let profileImageBase64 = null;
    let profileImageContentType = null;

    if (file instanceof File && file.size > 0) {
      const dataUrl = await readImage(file);
      profileImageBase64 = dataUrl.split(",", 2)[1];
      profileImageContentType = file.type;
    }

    const response = await fetch("/api/auth/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        displayName: formData.get("displayName"),
        profileImageBase64,
        profileImageContentType,
        removeProfileImage: formData.get("removeProfileImage") === "on",
      }),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      setProfileError(result.error || "Unable to update the profile.");
      setProfileSaving(false);
      return;
    }

    setUser(result.user);
    publishAuthChange(result.user);
    setPhotoVersion(Date.now());
    setProfileSaving(false);
    profileDialogRef.current?.close();
  }

  if (loading) {
    return <span className="h-10 w-16 animate-pulse rounded-full bg-black/8" aria-label="Checking login status" />;
  }

  if (user) {
    return (
      <>
        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="block overflow-hidden rounded-full border-2 border-white bg-[#07111f] shadow-[0_8px_22px_rgba(21,35,33,0.2)] ring-1 ring-[#152321]/15 hover:-translate-y-0.5"
            aria-label="Open account menu"
            aria-expanded={menuOpen}
          >
            {user.hasProfileImage ? (
              <Image
                src={`/api/auth/avatar?v=${photoVersion}`}
                alt={user.displayName ? `${user.displayName} profile photo` : "Profile photo"}
                width={40}
                height={40}
                unoptimized
                className="h-10 w-10 object-cover"
              />
            ) : (
              <span className="flex h-10 w-10 items-center justify-center bg-gradient-to-br from-[#1b5e59] to-[#152321] text-sm font-bold tracking-[0.08em] text-white">
                {getInitials(user.displayName || user.email)}
              </span>
            )}
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-12 w-64 rounded-2xl border border-black/10 bg-white p-3 text-sm shadow-[0_18px_45px_rgba(21,35,33,0.18)]">
              {user.displayName && <p className="truncate px-2 pt-1 font-semibold text-[#152321]">{user.displayName}</p>}
              <p className="truncate px-2 py-1 text-xs text-black/55">{user.email}</p>
              <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="mt-2 block w-full rounded-xl border border-[#152321]/12 px-3 py-2 text-center font-semibold text-[#152321] hover:bg-[#f4eee5]">Work dashboard</Link>
              <button type="button" onClick={openProfile} className="mt-2 w-full rounded-xl border border-[#152321]/12 px-3 py-2 font-semibold text-[#152321] hover:bg-[#f4eee5]">Edit profile</button>
              <button type="button" onClick={handleLogout} className="mt-2 w-full rounded-xl bg-[#152321] px-3 py-2 font-semibold text-white hover:bg-[#0f1a18]">Log out</button>
            </div>
          )}
        </div>

        <dialog
          ref={profileDialogRef}
          onClick={(event) => { if (event.target === profileDialogRef.current) profileDialogRef.current.close(); }}
          className="m-auto w-[min(92vw,29rem)] rounded-3xl border border-black/10 bg-[#fffdfa] p-0 text-[#152321] shadow-[0_30px_90px_rgba(21,35,33,0.28)] backdrop:bg-[#07111f]/55 backdrop:backdrop-blur-sm"
        >
          <form onSubmit={handleProfileSave} className="p-7 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-black/40">Account</p>
                <h2 className="mt-2 text-2xl font-semibold">Edit profile</h2>
              </div>
              <button type="button" onClick={() => profileDialogRef.current?.close()} className="rounded-full border border-black/10 px-3 py-1.5 text-sm hover:bg-black/5">Close</button>
            </div>

            <div className="mt-6 flex items-center gap-4">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#1b5e59] to-[#152321] text-xl font-bold tracking-[0.08em] text-white">
                {profilePreview ? (
                  <Image src={profilePreview} alt="Profile photo preview" width={80} height={80} unoptimized className="h-20 w-20 object-cover" />
                ) : (
                  getInitials(user.displayName || user.email)
                )}
              </div>
              <div>
                <p className="text-sm font-semibold">Profile photo</p>
                <p className="mt-1 text-xs leading-5 text-black/55">JPEG, PNG, or WebP. Maximum 2 MB.</p>
              </div>
            </div>

            <label className="mt-6 block text-sm font-semibold" htmlFor="profile-display-name">Display name</label>
            <input id="profile-display-name" name="displayName" type="text" maxLength={100} defaultValue={user.displayName || ""} autoComplete="name" className="mt-2 w-full rounded-2xl border border-black/12 bg-white px-4 py-3 outline-none focus:border-[#1b5e59] focus:ring-2 focus:ring-[#1b5e59]/15" />

            <label className="mt-4 block text-sm font-semibold" htmlFor="profile-photo">Upload a new photo</label>
            <input id="profile-photo" name="profilePhoto" type="file" accept="image/jpeg,image/png,image/webp" onChange={handlePhotoChange} className="mt-2 block w-full rounded-2xl border border-black/12 bg-white px-3 py-3 text-sm file:mr-3 file:rounded-full file:border-0 file:bg-[#f3ece0] file:px-4 file:py-2 file:font-semibold file:text-[#152321]" />

            {user.hasProfileImage && (
              <label className="mt-4 flex items-center gap-3 text-sm text-black/68">
                <input name="removeProfileImage" type="checkbox" className="h-4 w-4 rounded border-black/20" />
                Remove current photo and use initials
              </label>
            )}

            {profileError && <p className="mt-4 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{profileError}</p>}

            <button type="submit" disabled={profileSaving} className="mt-6 w-full rounded-2xl bg-[#152321] px-4 py-3 font-semibold text-white hover:bg-[#0f1a18] disabled:cursor-wait disabled:opacity-60">
              {profileSaving ? "Saving…" : "Save profile"}
            </button>
          </form>
        </dialog>
      </>
    );
  }

  const isLoginMode = mode === "login";
  const isRegisterMode = mode === "register";
  const isForgotMode = mode === "forgot";
  const isResetMode = mode === "reset";
  const submitLabel = isRegisterMode
    ? "Create account"
    : isForgotMode
      ? "Send reset code"
      : isResetMode
        ? "Update password"
        : "Sign in";

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setMode("login");
          setError("");
          setMessage("");
          resetTurnstile(turnstileWidgetIdRef, setTurnstileToken);
          dialogRef.current?.showModal();
        }}
        className="rounded-full border border-[#152321]/18 bg-white px-4 py-2 text-sm font-semibold text-[#152321] hover:-translate-y-0.5 hover:bg-[#f4eee5]"
      >
        Login
      </button>
      {turnstileSiteKey ? (
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
          strategy="afterInteractive"
          onLoad={renderTurnstileWidget}
        />
      ) : null}
      <dialog
        ref={dialogRef}
        onClick={(event) => { if (event.target === dialogRef.current) dialogRef.current.close(); }}
        className="m-auto max-h-[92dvh] w-[min(92vw,26rem)] overflow-y-auto rounded-3xl border border-black/10 bg-[#fffdfa] p-0 text-[#152321] shadow-[0_30px_90px_rgba(21,35,33,0.28)] backdrop:bg-[#07111f]/55 backdrop:backdrop-blur-sm"
      >
        <form onSubmit={handleAuthSubmit} className="p-7 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-black/40">Account</p>
              <h2 className="mt-2 text-2xl font-semibold">{authModeTitle[mode] || authModeTitle.login}</h2>
              {isForgotMode && (
                <p className="mt-2 text-sm leading-6 text-black/58">
                  Enter your email and we&apos;ll send a reset code if the account exists.
                </p>
              )}
              {isResetMode && (
                <p className="mt-2 text-sm leading-6 text-black/58">
                  Paste the code from your email and choose a new password.
                </p>
              )}
            </div>
            <button type="button" onClick={() => dialogRef.current?.close()} className="rounded-full border border-black/10 px-3 py-1.5 text-sm hover:bg-black/5" aria-label="Close login form">Close</button>
          </div>
          <label className="mt-7 block text-sm font-semibold" htmlFor="login-email">Email</label>
          <input id="login-email" name="email" type="email" autoComplete="email" required className="mt-2 w-full rounded-2xl border border-black/12 bg-white px-4 py-3 outline-none focus:border-[#1b5e59] focus:ring-2 focus:ring-[#1b5e59]/15" />
          {isResetMode && (
            <>
              <label className="mt-4 block text-sm font-semibold" htmlFor="reset-code">Reset code</label>
              <textarea id="reset-code" name="resetCode" rows={3} required className="mt-2 w-full resize-y rounded-2xl border border-black/12 bg-white px-4 py-3 outline-none focus:border-[#1b5e59] focus:ring-2 focus:ring-[#1b5e59]/15" />
            </>
          )}
          {!isForgotMode && (
            <>
              <label className="mt-4 block text-sm font-semibold" htmlFor="login-password">{isResetMode ? "New password" : "Password"}</label>
              <input id="login-password" name="password" type="password" minLength={8} autoComplete={isLoginMode ? "current-password" : "new-password"} required className="mt-2 w-full rounded-2xl border border-black/12 bg-white px-4 py-3 outline-none focus:border-[#1b5e59] focus:ring-2 focus:ring-[#1b5e59]/15" />
            </>
          )}
          {(isRegisterMode || isResetMode) && (
            <>
              <label className="mt-4 block text-sm font-semibold" htmlFor="register-confirm-password">Confirm password</label>
              <input id="register-confirm-password" name="confirmPassword" type="password" minLength={8} autoComplete="new-password" required className="mt-2 w-full rounded-2xl border border-black/12 bg-white px-4 py-3 outline-none focus:border-[#1b5e59] focus:ring-2 focus:ring-[#1b5e59]/15" />
            </>
          )}
          <div className="mt-5">
            {turnstileSiteKey ? (
              <div ref={turnstileRef} />
            ) : (
              <p className="rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-800">
                Add NEXT_PUBLIC_TURNSTILE_SITE_KEY to enable account access.
              </p>
            )}
          </div>
          {message && <p className="mt-4 rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-800">{message}</p>}
          {error && <p className="mt-4 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
          <button type="submit" disabled={submitting || !turnstileSiteKey || !turnstileToken} className="mt-6 w-full rounded-2xl bg-[#152321] px-4 py-3 font-semibold text-white hover:bg-[#0f1a18] disabled:cursor-wait disabled:opacity-60">
            {submitting ? "Please wait…" : submitLabel}
          </button>
          {isLoginMode && (
            <button
              type="button"
              onClick={() => {
                setMode("forgot");
                setError("");
                setMessage("");
                resetTurnstile(turnstileWidgetIdRef, setTurnstileToken);
              }}
              className="mt-3 w-full rounded-2xl px-4 py-2 text-sm font-semibold text-[#1b5e59] hover:bg-[#1b5e59]/7"
            >
              Forgot password?
            </button>
          )}
          {isForgotMode && (
            <button
              type="button"
              onClick={() => {
                setMode("reset");
                setError("");
                setMessage("");
                resetTurnstile(turnstileWidgetIdRef, setTurnstileToken);
              }}
              className="mt-3 w-full rounded-2xl px-4 py-2 text-sm font-semibold text-[#1b5e59] hover:bg-[#1b5e59]/7"
            >
              Already have a reset code?
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              setMode((value) => value === "login" ? "register" : "login");
              setError("");
              setMessage("");
              resetTurnstile(turnstileWidgetIdRef, setTurnstileToken);
            }}
            className="mt-3 w-full rounded-2xl px-4 py-2 text-sm font-semibold text-[#1b5e59] hover:bg-[#1b5e59]/7"
          >
            {isLoginMode ? "Need an account? Register" : "Back to sign in"}
          </button>
        </form>
      </dialog>
    </>
  );
}
