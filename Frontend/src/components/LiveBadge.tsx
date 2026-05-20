"use client";
import React from "react";

interface LiveBadgeProps {
  size?: "sm" | "md";
}

export function LiveBadge({ size = "sm" }: LiveBadgeProps) {
  const isLg = size === "md";
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: isLg ? "0.5rem" : "0.375rem",
        background: "rgba(255,68,68,0.15)",
        border: "1px solid rgba(255,68,68,0.4)",
        borderRadius: "9999px",
        padding: isLg ? "0.35rem 0.75rem" : "0.2rem 0.55rem",
        fontSize: isLg ? "0.8rem" : "0.7rem",
        fontWeight: 700,
        color: "#ff4444",
        letterSpacing: "0.05em",
        textTransform: "uppercase",
      }}
    >
      <span
        style={{
          width: isLg ? "8px" : "6px",
          height: isLg ? "8px" : "6px",
          borderRadius: "50%",
          background: "#ff4444",
          flexShrink: 0,
          animation: "pulse 1.5s ease-in-out infinite",
        }}
      />
      Live
    </span>
  );
}
