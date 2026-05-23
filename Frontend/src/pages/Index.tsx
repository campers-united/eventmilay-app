"use client";

import Link from "next/link";
import { ArrowRight, Calendar, MapPin, Radio, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LiveBadge } from "@/components/LiveBadge";
import { useEffect, useState } from "react";
import { api, type ApiEvent, type ApiSession } from "@/lib/apiClient";
import { useNow } from "@/hooks/useNow";

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function Index() {
  const now = useNow();
  const [events, setEvents] = useState<ApiEvent[]>([]);
  const [liveSessions, setLiveSessions] = useState<ApiSession[]>([]);
  const [apiError, setApiError] = useState(false);

  useEffect(() => {
    api.events.list().then(setEvents).catch(() => setApiError(true));
    api.sessions.live().then(setLiveSessions).catch(() => {}); // optional
  }, []);

  // Refresh live sessions every 30s
  useEffect(() => {
    const id = setInterval(() => {
      api.sessions.live().then(setLiveSessions).catch(() => {});
    }, 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="px-4 sm:px-8 py-8 sm:py-10 max-w-7xl mx-auto w-full">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-border/60 bg-card/40 backdrop-blur-md p-6 sm:p-10 lg:p-14 shadow-elegant">
        <div className="absolute inset-0 bg-gradient-primary opacity-10 pointer-events-none" />
        <div className="relative max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/40 px-3 py-1 text-xs text-muted-foreground mb-5">
            <Sparkles className="h-3.5 w-3.5 text-primary-glow" />
            Plateforme événementielle temps réel
          </div>
          <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight">
            Vivez vos événements <span className="text-gradient">en direct.</span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-2xl">
            Planning multi-track, sessions live et Q&amp;A temps réel. Tout ce qu&apos;il faut pour
            naviguer un événement et engager les participants — sans friction.
          </p>
          <div className="mt-6 sm:mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="bg-gradient-primary text-primary-foreground border-0 shadow-glow hover:opacity-90">
              <Link href="/live">
                Voir le planning <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-background/30 backdrop-blur">
              <Link href="/live">
                <Radio className="mr-2 h-4 w-4" />
                Sessions en direct {liveSessions.length > 0 && `(${liveSessions.length})`}
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* API error banner */}
      {apiError && (
        <div
          style={{
            marginTop: "1.5rem",
            padding: "1rem 1.25rem",
            borderRadius: "0.875rem",
            background: "rgba(255,68,68,0.08)",
            border: "1px solid rgba(255,68,68,0.25)",
            fontSize: "0.875rem",
            color: "#ff8888",
          }}
        >
          ⚠️ Le backend n&apos;est pas accessible. Lancez le serveur avec{" "}
          <code
            style={{
              background: "rgba(255,255,255,0.08)",
              padding: "0.1rem 0.4rem",
              borderRadius: "0.3rem",
            }}
          >
            node src/server.js
          </code>{" "}
          dans le dossier <code style={{ background: "rgba(255,255,255,0.08)", padding: "0.1rem 0.4rem", borderRadius: "0.3rem" }}>Backend/</code>.
        </div>
      )}

      {/* Sessions live */}
      {liveSessions.length > 0 && (
        <section className="mt-10 sm:mt-14">
          <div className="flex items-center justify-between mb-5 sm:mb-6">
            <h2 className="font-display text-xl sm:text-2xl font-semibold flex items-center gap-3">
              <LiveBadge size="md" /> En direct maintenant
            </h2>
            <Link href="/live" className="text-sm text-primary-glow hover:underline shrink-0">
              Tout voir
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {liveSessions.map((s) => (
              <Link key={s.id} href={`/sessions/${s.id}`}>
                <Card className="p-5 border-live/40 bg-card/80 hover:border-live transition-smooth shadow-glow h-full">
                  <LiveBadge />
                  <h3 className="font-display font-semibold text-lg mt-3 leading-snug">{s.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{s.description}</p>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Événements */}
      <section className="mt-12 sm:mt-16">
        <div className="flex items-end justify-between mb-5 sm:mb-6">
          <h2 className="font-display text-xl sm:text-2xl font-semibold">Événements à l&apos;affiche</h2>
        </div>
        {events.length === 0 && !apiError ? (
          <div
            style={{
              padding: "3rem",
              textAlign: "center",
              color: "var(--muted-foreground)",
              background: "rgba(26,26,36,0.4)",
              borderRadius: "1rem",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            {apiError ? "Impossible de charger les événements." : "Aucun événement pour l'instant."}
          </div>
        ) : (
          <div className="grid gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((ev) => (
              <Link key={ev.id} href={`/events/${ev.id}`} className="group">
                <Card className="overflow-hidden border-border/60 bg-card/70 backdrop-blur transition-smooth hover:-translate-y-1 hover:shadow-elegant h-full flex flex-col">
                  <div className={`h-28 sm:h-32 bg-gradient-to-br ${ev.coverColor ?? "from-primary to-accent"} relative`}>
                    <div className="absolute inset-0 bg-background/20" />
                  </div>
                  <div className="p-4 sm:p-5 flex-1 flex flex-col">
                    <Badge variant="secondary" className="self-start mb-2 text-[10px] uppercase tracking-wider">
                      {fmtDate(ev.startDate)}
                    </Badge>
                    <h3 className="font-display font-semibold text-base sm:text-lg group-hover:text-primary-glow transition-smooth">
                      {ev.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2 flex-1">{ev.description}</p>
                    <div className="mt-3 sm:mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {fmtDate(ev.startDate)}
                      </span>
                      {ev.location && (
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          {ev.location}
                        </span>
                      )}
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
