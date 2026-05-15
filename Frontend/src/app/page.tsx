"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Calendar, Home, Radio } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LiveBadge } from "@/components/LiveBadge";
import { api, type ApiEvent, type ApiSession } from "@/lib/apiClient";

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function HomePage() {
  const [events, setEvents] = useState<ApiEvent[]>([]);
  const [liveSessions, setLiveSessions] = useState<ApiSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const fetchData = async () => {
      try {
        const [eventsData, liveData] = await Promise.all([api.events.list(), api.sessions.live()]);
        if (!active) return;
        setEvents(eventsData);
        setLiveSessions(liveData);
      } catch (error) {
        console.error(error);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchData();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="px-4 sm:px-8 py-8 sm:py-10 max-w-7xl mx-auto w-full">
      <section className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-border/60 bg-card/40 backdrop-blur-md p-6 sm:p-10 lg:p-14 shadow-elegant bg-aurora animate-fade-in">
        <div className="absolute inset-0 bg-gradient-primary opacity-10 pointer-events-none" />
        {/* Floating orbs */}
        <div aria-hidden className="absolute -top-20 -right-16 h-72 w-72 rounded-full bg-primary/30 blur-3xl animate-float-slow pointer-events-none" />
        <div aria-hidden className="absolute -bottom-24 -left-10 h-72 w-72 rounded-full bg-accent/30 blur-3xl animate-float-slow pointer-events-none" style={{ animationDelay: "-7s" }} />
        <div aria-hidden className="absolute top-1/2 left-1/3 h-2 w-2 rounded-full bg-primary-glow animate-sparkle" />
        <div aria-hidden className="absolute top-10 right-1/3 h-1.5 w-1.5 rounded-full bg-accent animate-sparkle" style={{ animationDelay: "-1s" }} />
        <div className="relative max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/40 px-3 py-1 text-xs text-muted-foreground mb-5 animate-fade-in-up">
            <Radio className="h-3.5 w-3.5 text-primary-glow" />
            Plateforme événementielle temps réel
          </div>
          <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            Vivez vos événements <span className="text-shimmer">en direct.</span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-2xl animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            Planning multi-track, sessions live et Q&amp;A temps réel. Tout ce qu&apos;il faut pour
            naviguer un événement et engager les participants — sans friction.
          </p>
          <div className="mt-6 sm:mt-8 flex flex-wrap gap-3 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <Button asChild size="lg" className="bg-gradient-primary text-primary-foreground border-0 btn-glow hover:opacity-90 hover:scale-105 transition-transform">
              <Link href="/events/ev1/planning">
                Voir le planning <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-background/30 backdrop-blur hover:scale-105 transition-transform">
              <Link href="/live">
                <Radio className="mr-2 h-4 w-4 animate-pulse" />
                Sessions en direct {liveSessions.length > 0 && `(${liveSessions.length})`}
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {loading ? (
        <div className="mt-10 text-sm text-muted-foreground">Chargement des événements…</div>
      ) : (
        liveSessions.length > 0 && (
        <section className="mt-10 sm:mt-14">
          <div className="flex items-center justify-between mb-5 sm:mb-6">
            <h2 className="font-display text-xl sm:text-2xl font-semibold flex items-center gap-3">
              <LiveBadge size="md" /> En direct maintenant
            </h2>
            <Link href="/live" className="text-sm text-primary-glow hover:underline shrink-0">
              Tout voir
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 stagger">
            {liveSessions.map((s) => (
              <Link key={s.id} href={`/sessions/${s.id}`} className="group">
                <Card className="relative p-5 border-live/40 bg-card/80 hover:border-live shadow-glow h-full hover-lift card-sheen overflow-hidden">
                  <span aria-hidden className="absolute inset-0 bg-gradient-live opacity-5 group-hover:opacity-15 transition-opacity" />
                  <LiveBadge />
                  <h3 className="relative font-display font-semibold text-lg mt-3 leading-snug group-hover:text-primary-glow transition-smooth">
                    {s.title}
                  </h3>
                  <p className="relative mt-1 text-sm text-muted-foreground line-clamp-2">
                    {s.description}
                  </p>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mt-12 sm:mt-16">
        <div className="flex items-end justify-between mb-5 sm:mb-6">
          <h2 className="font-display text-xl sm:text-2xl font-semibold animate-fade-in-up">Événements à l&apos;affiche</h2>
        </div>
        <div className="grid gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3 stagger">
          {events.map((ev) => (
            <Link key={ev.id} href={`/events/${ev.id}`} className="group">
              <Card className="overflow-hidden border-border/60 bg-card/70 backdrop-blur hover-lift card-sheen h-full flex flex-col">
                <div className={`h-28 sm:h-32 bg-gradient-to-br ${ev.coverColor} relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-background/20" />
                  <div aria-hidden className="absolute -inset-1 bg-gradient-to-tr from-primary-glow/0 via-primary-glow/20 to-accent/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div aria-hidden className="absolute top-3 right-3 h-1.5 w-1.5 rounded-full bg-white/70 animate-sparkle" />
                </div>
                <div className="p-4 sm:p-5 flex-1 flex flex-col">
                  <Badge variant="secondary" className="self-start mb-2 text-[10px] uppercase tracking-wider">
                    {fmtDate(ev.startDate)}
                  </Badge>
                  <h3 className="font-display font-semibold text-base sm:text-lg group-hover:text-primary-glow transition-smooth">
                    {ev.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2 flex-1">
                    {ev.description}
                  </p>
                  <div className="mt-3 sm:mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {fmtDate(ev.startDate)}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Home className="h-3.5 w-3.5" />
                      {ev.location}
                    </span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
