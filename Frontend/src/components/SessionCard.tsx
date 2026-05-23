"use client";
import React from "react";
import Link from "next/link";
import { Clock, MapPin, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { LiveBadge } from "@/components/LiveBadge";
import { Badge } from "@/components/ui/badge";
import { useFavorites } from "@/hooks/useFavorites";
import { useNow } from "@/hooks/useNow";
import type { ApiSession } from "@/lib/apiClient";

function fmt(d: string) {
  return new Date(d).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

interface SessionCardProps {
  session: ApiSession;
}

export function SessionCard({ session: s }: SessionCardProps) {
  const now = useNow();
  const { isFavorite, toggle } = useFavorites();
  const live = new Date(s.startTime) <= now && new Date(s.endTime) >= now;
  const fav = isFavorite(s.id);
  // Backend: speakers is SessionSpeaker[] with nested .speaker.fullName
  const speakerNames = s.speakers
    ?.map((sp) => sp.speaker?.fullName ?? "")
    .filter(Boolean)
    .join(", ");

  return (
    <Card
      style={{
        padding: "1.25rem",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        borderColor: live ? "rgba(255,68,68,0.4)" : undefined,
        boxShadow: live ? "0 0 20px rgba(255,68,68,0.15)" : undefined,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          {live && <LiveBadge />}
          {s.track && <Badge variant="secondary">{s.track}</Badge>}
        </div>
        <button
          onClick={(e) => { e.preventDefault(); toggle(s.id); }}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: fav ? "#f059c8" : "var(--muted-foreground)",
            fontSize: "1rem",
            padding: "0.25rem",
            flexShrink: 0,
          }}
          title={fav ? "Retirer des favoris" : "Ajouter aux favoris"}
        >
          <Star style={{ width: "1rem", height: "1rem", fill: fav ? "currentColor" : "none" }} />
        </button>
      </div>

      <Link href={`/sessions/${s.id}`} style={{ textDecoration: "none", flex: 1 }}>
        <h3
          style={{
            marginTop: "0.75rem",
            fontWeight: 600,
            fontSize: "1rem",
            lineHeight: 1.375,
            color: "var(--foreground)",
          }}
        >
          {s.title}
        </h3>
        {s.description && (
          <p
            style={{
              marginTop: "0.375rem",
              fontSize: "0.875rem",
              color: "var(--muted-foreground)",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {s.description}
          </p>
        )}
      </Link>

      <div
        style={{
          marginTop: "0.75rem",
          display: "flex",
          flexWrap: "wrap",
          gap: "0.75rem",
          fontSize: "0.75rem",
          color: "var(--muted-foreground)",
        }}
      >
        <span style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
          <Clock style={{ width: "0.875rem", height: "0.875rem" }} />
          {fmt(s.startTime)} – {fmt(s.endTime)}
        </span>
        {s.room && (
          <span style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
            <MapPin style={{ width: "0.875rem", height: "0.875rem" }} />
            {s.room.name}
          </span>
        )}
      </div>

      {speakerNames && (
        <div
          style={{
            marginTop: "0.5rem",
            fontSize: "0.75rem",
            color: "var(--primary-glow)",
          }}
        >
          {speakerNames}
        </div>
      )}
    </Card>
  );
}
