import React from "react";

interface BadgeProps {
  variant?: "default" | "secondary" | "live";
  className?: string;
  children?: React.ReactNode;
}

export function Badge({ variant = "default", className = "", children }: BadgeProps) {
  const base: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    borderRadius: "9999px",
    padding: "0.2rem 0.6rem",
    fontSize: "0.7rem",
    fontWeight: 600,
    letterSpacing: "0.05em",
  };

  const variants: Record<string, React.CSSProperties> = {
    default: { background: "linear-gradient(135deg, #7c5cfc, #f059c8)", color: "#fff" },
    secondary: { background: "rgba(124,92,252,0.15)", color: "var(--primary-glow)" },
    live: { background: "rgba(255,68,68,0.2)", color: "#ff4444" },
  };

  return (
    <span style={{ ...base, ...variants[variant] }} className={className}>
      {children}
    </span>
  );
}
