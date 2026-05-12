"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { api } from "@/lib/apiClient";
import { LiveBadge } from "@/components/LiveBadge";
import { Home, LayoutGrid, Mic2, Radio, Star } from "lucide-react";
import { cn } from "@/lib/utils";

const mobileNavItems = [
  { title: "Accueil", url: "/", icon: Home },
  { title: "Planning", url: "/events/ev1/planning", icon: LayoutGrid },
  { title: "Live", url: "/live", icon: Radio },
  { title: "Speakers", url: "/speakers", icon: Mic2 },
  { title: "Favoris", url: "/favorites", icon: Star },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [liveCount, setLiveCount] = useState(0);
  const pathname = usePathname() ?? "/";

  useEffect(() => {
    let active = true;

    api.sessions.live().then((sessions) => {
      if (!active) return;
      setLiveCount(sessions.length);
    }).catch(() => {
      if (!active) return;
      setLiveCount(0);
    });

    return () => {
      active = false;
    };
  }, []);

  const isActive = (url: string) =>
    url === "/" ? pathname === "/" : pathname.startsWith(url);

  return (
    <SidebarProvider>
      {/* Layout principal */}
      <div className="min-h-screen flex w-full bg-hero">
        {/* Sidebar — cachée sur mobile (md:flex) */}
        <div className="hidden md:block">
          <AppSidebar />
        </div>

        {/* Zone de contenu */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <header className="h-14 flex items-center justify-between border-b border-border/60 bg-background/40 backdrop-blur-md px-3 sticky top-0 z-30">
            <div className="flex items-center gap-2">
              {/* SidebarTrigger visible seulement sur desktop */}
              <span className="hidden md:inline-flex">
                <SidebarTrigger />
              </span>
              {/* Logo + nom sur mobile */}
              <Link href="/" className="flex items-center gap-2 md:hidden">
                <div className="h-7 w-7 rounded-lg bg-gradient-primary shadow-glow flex items-center justify-center">
                  <Radio className="h-3.5 w-3.5 text-primary-foreground" />
                </div>
                <span className="font-display font-bold text-base tracking-tight">EventFlow</span>
              </Link>
              <span className="text-sm text-muted-foreground hidden sm:inline ml-1">
                EAT · Antananarivo
              </span>
            </div>
            {liveCount > 0 && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <LiveBadge />
                <span className="hidden sm:inline">
                  {liveCount} session{liveCount > 1 ? "s" : ""} en direct
                </span>
                <span className="sm:hidden font-semibold text-live">{liveCount}</span>
              </div>
            )}
          </header>

          {/* Contenu principal — padding bas pour la bottom nav sur mobile */}
          <main className="flex-1 min-w-0 pb-20 md:pb-0">
            {children}
          </main>
        </div>
      </div>

      {/* Bottom navigation — visible seulement sur mobile */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden border-t border-border/60 bg-background/80 backdrop-blur-md safe-area-pb">
        <div className="flex items-center justify-around h-16 px-2">
          {mobileNavItems.map((item) => {
            const active = isActive(item.url);
            return (
              <Link
                key={item.url}
                href={item.url}
                className={cn(
                  "relative flex flex-col items-center justify-center gap-1 flex-1 py-2 text-[10px] font-medium transition-smooth rounded-xl mx-0.5",
                  active
                    ? "text-primary-glow"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <item.icon
                  className={cn(
                    "h-5 w-5 transition-smooth",
                    active && "drop-shadow-[0_0_6px_hsl(var(--primary-glow))]"
                  )}
                />
                <span>{item.title}</span>
                {item.url === "/live" && liveCount > 0 && (
                  <span className="absolute right-4 top-2 h-2 w-2 rounded-full bg-live animate-pulse" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </SidebarProvider>
  );
}