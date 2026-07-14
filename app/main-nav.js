"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import NavbarAuth from "./navbar-auth";

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

  useEffect(() => {
    const syncHash = () => setHash(window.location.hash);

    syncHash();
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, [pathname]);

  return (
    <nav className="flex flex-wrap items-center justify-end gap-2 sm:gap-3">
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
      <NavbarAuth />
    </nav>
  );
}
