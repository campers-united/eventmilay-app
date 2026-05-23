import React from "react";

interface CardProps {
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

export function Card({ className = "", children, style }: CardProps) {
  const base: React.CSSProperties = {
    borderRadius: "1rem",
    border: "1px solid rgba(255,255,255,0.06)",
    background: "rgba(26,26,36,0.7)",
    backdropFilter: "blur(12px)",
    transition: "all 0.2s ease",
    ...style,
  };

  return (
    <div style={base} className={className}>
      {children}
    </div>
  );
}
