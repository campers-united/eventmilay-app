"use client";

import Image from "next/image";
import Link from "next/link";
import { Clock, MapPin, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LiveBadge } from "@/components/LiveBadge";
import { useFavorites } from "@/hooks/useFavorites";
import { useNow } from "@/hooks/useNow";
import type { ApiSession } from "@/lib/apiClient";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

function fmt(d: string) {
  return new Date(d).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

function isLive(s: ApiSession, ref: Date) {
  return new Date(s.startTime) <= ref && new Date(s.endTime) >= ref;
}

export function SessionCard({ session, compact = false }: { session: ApiSession; compact?: boolean }) {
  const now = useNow(15_000);
  const [mounted, setMounted] = useState(false);
  const live = isLive(session, now);
  const { isFavorite, toggle } = useFavorites();
  const fav = isFavorite(session.id);

  useEffect(() => { setMounted(true); }, []);

  return (
    <Card
      className={cn(
        "group relative overflow-hidden border-border/60 bg-card/70 backdrop-blur-sm p-4 hover-lift card-sheen",
        live && "border-live/50 shadow-glow animate-pop-in"
      )}
    >
      {live && (
        <span
          aria-hidden
          className="pointer-events-none absolute -inset-px rounded-[inherit] bg-gradient-live opacity-20 blur-xl animate-glow-pulse"
        />
      )}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {live && <LiveBadge />}
            {session.track && (
              <Badge variant="secondary" className="text-[10px] uppercase tracking-wider">
                {session.track}
              </Badge>
            )}
          </div>
          <Link href={`/sessions/${session.id}`} className="block">
            <h3 className="font-display font-semibold text-base leading-snug group-hover:text-primary-glow transition-smooth">
              {session.title}
            </h3>
          </Link>
          {!compact && (
            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{session.description}</p>
          )}
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              <span suppressHydrationWarning>
                {mounted ? `${fmt(session.startTime)} – ${fmt(session.endTime)}` : "--:-- – --:--"}
              </span>
            </span>
            {session.room && (
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {session.room.name}
              </span>
            )}
          </div>
          {!compact && session.speakers.length > 0 && (
            <div className="mt-3 flex -space-x-2">
              {session.speakers.map(({ speaker }) =>
                speaker.photoUrl ? (
                  <Image
                    key={speaker.id}
                    src={speaker.photoUrl}
                    alt={speaker.fullName}
                    title={speaker.fullName}
                    width={28}
                    height={28}
                    className="h-7 w-7 rounded-full ring-2 ring-card object-cover"
                  />
                ) : null
              )}
            </div>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          aria-label={fav ? "Retirer des favoris" : "Ajouter aux favoris"}
          onClick={(e) => { e.preventDefault(); toggle(session.id); }}
          className={cn("shrink-0", fav && "text-primary-glow")}
        >
          <Star className={cn("h-4 w-4", fav && "fill-current")} />
        </Button>
      </div>
    </Card>
  );
}
