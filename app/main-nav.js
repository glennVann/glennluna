"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import NavbarAuth from "./navbar-auth";
import NotificationBell from "./notification-bell";

const navLinks = [
  { href: "/", label: "Home", exact: true },
  { href: "/about", label: "About Me" },
  { href: "/projects", label: "Projects" },
  { href: "/designer", label: "Designer" },
  { href: "/kids-corner", label: "Kids Corner" },
  { href: "/#contact", label: "Contact", matchPath: "/", hash: "#contact" },
  { href: "/quote", label: "Request Quote", featured: true },
];

const baseClass =
  "rounded-full border px-4 py-2 text-sm font-semibold transition hover:-translate-y-0.5";
const inactiveClass =
  "border-[#152321]/12 bg-white/80 text-[#152321] hover:bg-white";
const activeClass =
  "border-[#152321] bg-[#152321] text-white shadow-[0_12px_28px_rgba(21,35,33,0.12)] hover:bg-[#0f1a18]";

function isActiveLink(link, pathname, hash) {
  const targetPath = link.matchPath ?? link.href.split("#")[0];

  if (link.hash) {
    return pathname === targetPath && hash === link.hash;
  }

  if (link.exact) {
    return pathname === targetPath && !hash;
  }

  return pathname === targetPath || pathname.startsWith(`${targetPath}/`);
}

export default function MainNav() {
  const pathname = usePathname() || "/";
  const [hash, setHash] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const syncHash = () => setHash(window.location.hash);

    syncHash();
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, [pathname]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname, hash]);

  return (
    <nav className="relative flex items-center justify-end gap-2 sm:gap-3">
      <div className="hidden items-center justify-end gap-2 lg:flex">
        {navLinks.map((link) => {
          const isActive = isActiveLink(link, pathname, hash);

          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive ? "page" : undefined}
              className={`${baseClass} ${isActive || link.featured ? activeClass : inactiveClass}`}
            >
              {link.label}
            </Link>
          );
        })}
        <NotificationBell />
        <NavbarAuth />
      </div>

      <div className="flex items-center gap-2 lg:hidden">
        <NavbarAuth />
        <NotificationBell />

        <button
          type="button"
          onClick={() => {
            setMenuOpen((open) => !open);
          }}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#152321]/15 bg-white text-[#152321] shadow-[0_10px_24px_rgba(21,35,33,0.08)] transition hover:-translate-y-0.5 hover:bg-[#f4eee5]"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
        >
          <span className="sr-only">{menuOpen ? "Close menu" : "Open menu"}</span>
          <span className="flex flex-col gap-1.5">
            <span className={"h-0.5 w-5 rounded-full bg-current transition " + (menuOpen ? "translate-y-2 rotate-45" : "")} />
            <span className={"h-0.5 w-5 rounded-full bg-current transition " + (menuOpen ? "opacity-0" : "")} />
            <span className={"h-0.5 w-5 rounded-full bg-current transition " + (menuOpen ? "-translate-y-2 -rotate-45" : "")} />
          </span>
        </button>
      </div>

      {menuOpen && (
        <div className="absolute right-0 top-14 z-50 w-[min(86vw,22rem)] rounded-[1.5rem] border border-black/10 bg-[#fffdfa] p-3 shadow-[0_24px_70px_rgba(21,35,33,0.18)] lg:hidden">
          <div className="grid gap-2">
            {navLinks.map((link) => {
              const isActive = isActiveLink(link, pathname, hash);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  className={
                    "rounded-2xl px-4 py-3 text-sm font-semibold transition " +
                    (isActive || link.featured
                      ? "bg-[#152321] text-white"
                      : "bg-[#f7f2ea] text-[#152321] hover:bg-white")
                  }
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
