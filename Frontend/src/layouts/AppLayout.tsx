"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Radio, Star, Calendar, Home } from "lucide-react";

const navLinks = [
  { href: "/", label: "Accueil", icon: Home },
  { href: "/live", label: "Live", icon: Radio },
  { href: "/favorites", label: "Favoris", icon: Star },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "/";

  return (
    <>
      <nav>
        <div className="nav-inner">
          <Link href="/" className="nav-brand">
            ⚡ EventMilay
          </Link>
          <div className="nav-links">
            {navLinks.map(({ href, label, icon: Icon }) => {
              const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`nav-link${active ? " active" : ""}`}
                >
                  <Icon style={{ width: "0.9rem", height: "0.9rem", display: "inline", marginRight: "0.35rem", verticalAlign: "middle" }} />
                  {label}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
      <main style={{ flex: 1 }}>{children}</main>
      <footer
        style={{
          borderTop: "1px solid rgba(255,255,255,0.06)",
          padding: "1.5rem 2rem",
          textAlign: "center",
          fontSize: "0.8rem",
          color: "var(--muted-foreground)",
        }}
      >
        © 2025 EventMilay — Plateforme événementielle
      </footer>
    </>
  );
}
