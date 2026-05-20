import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "default" | "lg";
  asChild?: boolean;
  children?: React.ReactNode;
}

export function Button({
  variant = "default",
  size = "default",
  asChild,
  children,
  className = "",
  style,
  ...props
}: ButtonProps) {
  const base: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "9999px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s ease",
    textDecoration: "none",
    border: "1px solid transparent",
  };

  const sizes: Record<string, React.CSSProperties> = {
    sm: { padding: "0.375rem 0.75rem", fontSize: "0.8rem" },
    default: { padding: "0.5rem 1.25rem", fontSize: "0.875rem" },
    lg: { padding: "0.75rem 1.75rem", fontSize: "1rem" },
  };

  const variants: Record<string, React.CSSProperties> = {
    default: {
      background: "linear-gradient(135deg, #7c5cfc, #f059c8)",
      color: "#fff",
    },
    outline: {
      background: "rgba(26,26,36,0.3)",
      color: "var(--foreground)",
      border: "1px solid rgba(255,255,255,0.1)",
    },
    ghost: {
      background: "transparent",
      color: "var(--muted-foreground)",
    },
  };

  const combinedStyle = { ...base, ...sizes[size], ...variants[variant], ...style };

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<React.HTMLAttributes<HTMLElement>>, {
      style: combinedStyle,
      className,
    });
  }

  return (
    <button style={combinedStyle} className={className} {...props}>
      {children}
    </button>
  );
}
