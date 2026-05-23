"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Calendar, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SessionCard } from "@/components/SessionCard";
import { api, type ApiEventDetail, type ApiSession } from "@/lib/apiClient";
import { useNow } from "@/hooks/useNow";

function isLive(s: ApiSession, ref: Date) {
  return new Date(s.startTime) <= ref && new Date(s.endTime) >= ref;
}

function fmtDateRange(start: string, end: string) {
  const s = new Date(start);
  const e = new Date(end);
  return `${s.toLocaleDateString("fr-FR", { day: "numeric", month: "long" })} – ${e.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}`;
}

export default function EventPage() {
  const params = useParams();
  const rawId = params?.eventId;
  const eventId = typeof rawId === "string" ? rawId : Array.isArray(rawId) ? rawId[0] : "ev1";
  const [ev, setEv] = useState<ApiEventDetail | null>(null);
  const now = useNow();
  const [filter, setFilter] = useState<"all" | "live" | "upcoming">("all");

  useEffect(() => {
    api.events.get(eventId).then(setEv).catch(console.error);
  }, [eventId]);

  if (!ev) return <div className="p-10 text-muted-foreground">Chargement…</div>;

  const tracks = Array.from(new Set(ev.sessions.map((s) => s.track).filter(Boolean))) as string[];

  const filtered = ev.sessions.filter((s) => {
    if (filter === "live") return isLive(s, now);
    if (filter === "upcoming") return new Date(s.startTime) > now;
    return true;
  });

  return (
    <div className="px-4 sm:px-8 py-8 max-w-7xl mx-auto w-full">
      <div className="rounded-2xl sm:rounded-3xl overflow-hidden border border-border/60 shadow-elegant">
        <div className={`h-36 sm:h-44 bg-gradient-to-br ${ev.coverColor ?? "from-primary to-accent"} relative`}>
          <div className="absolute inset-0 bg-background/30" />
        </div>
        <div className="bg-card/70 backdrop-blur p-5 sm:p-8">
          <div className="flex flex-wrap gap-2 mb-3">
            {tracks.map((t) => (
              <Badge key={t} variant="secondary" className="text-[10px] uppercase tracking-wider">{t}</Badge>
            ))}
          </div>
          <h1 className="font-display text-2xl sm:text-4xl font-bold tracking-tight">{ev.title}</h1>
          <p className="mt-2 text-muted-foreground max-w-3xl text-sm sm:text-base">{ev.description}</p>
          <div className="mt-4 sm:mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <Calendar className="h-4 w-4 shrink-0" />
              {fmtDateRange(ev.startDate, ev.endDate)}
            </span>
            <span className="inline-flex items-center gap-2">
              <MapPin className="h-4 w-4 shrink-0" />
              {ev.location}
            </span>
          </div>
          <div className="mt-5 sm:mt-6">
            <Button asChild className="bg-gradient-primary text-primary-foreground border-0 w-full sm:w-auto">
              <Link href={`/events/${ev.id}/planning`}>Ouvrir le planning</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="font-display text-xl sm:text-2xl font-semibold">Sessions</h2>
        <div className="inline-flex self-start sm:self-auto rounded-full border border-border/60 bg-card/50 p-1">
          {(["all", "live", "upcoming"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 sm:px-4 py-1.5 text-xs rounded-full transition-smooth ${
                filter === f
                  ? "bg-gradient-primary text-primary-foreground shadow-glow"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {f === "all" ? "Toutes" : f === "live" ? "En direct" : "À venir"}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 sm:mt-5 grid gap-4 md:grid-cols-2">
        {filtered.map((s) => <SessionCard key={s.id} session={s} />)}
        {filtered.length === 0 && (
          <p className="text-muted-foreground col-span-full">Aucune session pour ce filtre.</p>
        )}
      </div>
    </div>
  );
}
