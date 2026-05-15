import { cn } from "@/lib/utils";

interface Props {
  className?: string;
  size?: "sm" | "md";
}

export function LiveBadge({ className, size = "sm" }: Props) {
  return (
    <span
      className={cn(
        "relative inline-flex items-center gap-1.5 rounded-full bg-gradient-live text-live-foreground font-display font-semibold uppercase tracking-wider live-pulse overflow-hidden",
        size === "sm" ? "text-[10px] px-2 py-0.5" : "text-xs px-3 py-1",
        className
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-live-foreground live-dot" />
      <span className="relative z-10">Live</span>
      <span
        aria-hidden
        className="absolute inset-0 -z-0 bg-gradient-to-r from-transparent via-white/40 to-transparent w-1/2 animate-shimmer"
      />
    </span>
  );
}