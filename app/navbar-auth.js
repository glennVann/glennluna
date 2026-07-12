"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const AUTH_CHANGED_EVENT = "glennluna:auth-changed";

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

export default function NavbarAuth() {
  const dialogRef = useRef(null);
  const profileDialogRef = useRef(null);
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
    publishAuthChange(result.user);
    setSubmitting(false);
    dialogRef.current?.close();
  }

  async function handleRegister(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setMessage("");
    const formData = new FormData(event.currentTarget);
    const password = formData.get("password");
    if (password !== formData.get("confirmPassword")) {
      setError("Passwords do not match.");
      setSubmitting(false);
      return;
    }
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: formData.get("email"), password }),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      setError(result.error || "Unable to create the account.");
      setSubmitting(false);
      return;
    }
    setMode("login");
    setMessage("Account created. Check your email and confirm your address before signing in.");
    setSubmitting(false);
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setMenuOpen(false);
    setUser(null);
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

  return (
    <>
      <button
        type="button"
        onClick={() => { setMode("login"); setError(""); setMessage(""); dialogRef.current?.showModal(); }}
        className="rounded-full border border-[#152321]/18 bg-white px-4 py-2 text-sm font-semibold text-[#152321] hover:-translate-y-0.5 hover:bg-[#f4eee5]"
      >
        Login
      </button>
      <dialog
        ref={dialogRef}
        onClick={(event) => { if (event.target === dialogRef.current) dialogRef.current.close(); }}
        className="m-auto w-[min(92vw,26rem)] rounded-3xl border border-black/10 bg-[#fffdfa] p-0 text-[#152321] shadow-[0_30px_90px_rgba(21,35,33,0.28)] backdrop:bg-[#07111f]/55 backdrop:backdrop-blur-sm"
      >
        <form onSubmit={mode === "login" ? handleLogin : handleRegister} className="p-7 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-black/40">Account</p>
              <h2 className="mt-2 text-2xl font-semibold">{mode === "login" ? "Welcome back" : "Create account"}</h2>
            </div>
            <button type="button" onClick={() => dialogRef.current?.close()} className="rounded-full border border-black/10 px-3 py-1.5 text-sm hover:bg-black/5" aria-label="Close login form">Close</button>
          </div>
          <label className="mt-7 block text-sm font-semibold" htmlFor="login-email">Email</label>
          <input id="login-email" name="email" type="email" autoComplete="email" required className="mt-2 w-full rounded-2xl border border-black/12 bg-white px-4 py-3 outline-none focus:border-[#1b5e59] focus:ring-2 focus:ring-[#1b5e59]/15" />
          <label className="mt-4 block text-sm font-semibold" htmlFor="login-password">Password</label>
          <input id="login-password" name="password" type="password" minLength={8} autoComplete={mode === "login" ? "current-password" : "new-password"} required className="mt-2 w-full rounded-2xl border border-black/12 bg-white px-4 py-3 outline-none focus:border-[#1b5e59] focus:ring-2 focus:ring-[#1b5e59]/15" />
          {mode === "register" && (
            <>
              <label className="mt-4 block text-sm font-semibold" htmlFor="register-confirm-password">Confirm password</label>
              <input id="register-confirm-password" name="confirmPassword" type="password" minLength={8} autoComplete="new-password" required className="mt-2 w-full rounded-2xl border border-black/12 bg-white px-4 py-3 outline-none focus:border-[#1b5e59] focus:ring-2 focus:ring-[#1b5e59]/15" />
            </>
          )}
          {message && <p className="mt-4 rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-800">{message}</p>}
          {error && <p className="mt-4 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
          <button type="submit" disabled={submitting} className="mt-6 w-full rounded-2xl bg-[#152321] px-4 py-3 font-semibold text-white hover:bg-[#0f1a18] disabled:cursor-wait disabled:opacity-60">
            {submitting ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}
          </button>
          <button
            type="button"
            onClick={() => { setMode((value) => value === "login" ? "register" : "login"); setError(""); setMessage(""); }}
            className="mt-3 w-full rounded-2xl px-4 py-2 text-sm font-semibold text-[#1b5e59] hover:bg-[#1b5e59]/7"
          >
            {mode === "login" ? "Need an account? Register" : "Already registered? Sign in"}
          </button>
        </form>
      </dialog>
    </>
  );
}
