"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Clock, MapPin, ChevronLeft, Filter } from "lucide-react";
import { api, type ApiEventDetail, type ApiSession } from "@/lib/apiClient";
import { useNow } from "@/hooks/useNow";
import { useFavorites } from "@/hooks/useFavorites";
import { LiveBadge } from "@/components/LiveBadge";
import { Badge } from "@/components/ui/badge";

/* ─── helpers ─────────────────────────────────────────── */
function fmt(d: string) {
  return new Date(d).toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}
function fmtDay(d: string) {
  return new Date(d).toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}
function sameDay(a: string, b: string) {
  const da = new Date(a);
  const db = new Date(b);
  return (
    da.getFullYear() === db.getFullYear() &&
    da.getMonth() === db.getMonth() &&
    da.getDate() === db.getDate()
  );
}
function isLive(s: ApiSession, now: Date) {
  return new Date(s.startTime) <= now && new Date(s.endTime) >= now;
}

/* ─── component ───────────────────────────────────────── */
export default function PlanningPage() {
  const params = useParams();
  const rawId = params?.eventId;
  const eventId =
    typeof rawId === "string"
      ? rawId
      : Array.isArray(rawId)
      ? rawId[0]
      : "";

  const [ev, setEv] = useState<ApiEventDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [trackFilter, setTrackFilter] = useState<string>("all");
  const now = useNow();
  const { isFavorite, toggle } = useFavorites();

  useEffect(() => {
    if (!eventId) return;
    api.events
      .get(eventId)
      .then(setEv)
      .catch((e) => setError(String(e)));
  }, [eventId]);

  /* derive days and tracks from sessions */
  const days = useMemo(() => {
    if (!ev) return [];
    const seen = new Set<string>();
    const list: string[] = [];
    for (const s of ev.sessions) {
      const key = new Date(s.startTime).toDateString();
      if (!seen.has(key)) {
        seen.add(key);
        list.push(s.startTime);
      }
    }
    return list.sort((a, b) => +new Date(a) - +new Date(b));
  }, [ev]);

  const tracks = useMemo(() => {
    if (!ev) return [];
    return Array.from(
      new Set(ev.sessions.map((s) => s.track).filter(Boolean))
    ) as string[];
  }, [ev]);

  const [activeDay, setActiveDay] = useState<string | null>(null);
  useEffect(() => {
    if (days.length > 0 && !activeDay) setActiveDay(days[0]);
  }, [days, activeDay]);

  const sessionsForDay = useMemo(() => {
    if (!ev || !activeDay) return [];
    return ev.sessions
      .filter((s) => sameDay(s.startTime, activeDay))
      .filter((s) => trackFilter === "all" || s.track === trackFilter)
      .sort((a, b) => +new Date(a.startTime) - +new Date(b.startTime));
  }, [ev, activeDay, trackFilter]);

  /* ─── loading / error states ───────────────────────── */
  if (error) {
    return (
      <div
        style={{
          padding: "3rem 2rem",
          maxWidth: "48rem",
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <div
          style={{
            background: "rgba(255,68,68,0.1)",
            border: "1px solid rgba(255,68,68,0.3)",
            borderRadius: "1rem",
            padding: "2rem",
          }}
        >
          <p style={{ color: "#ff6666", fontWeight: 600, marginBottom: "0.5rem" }}>
            Impossible de charger le planning
          </p>
          <p style={{ color: "var(--muted-foreground)", fontSize: "0.875rem" }}>
            {error.includes("Failed to fetch")
              ? "Le serveur backend n'est pas accessible. Vérifiez que le backend tourne sur le port 5000."
              : error}
          </p>
          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              marginTop: "1.5rem",
              color: "var(--primary-glow)",
              fontSize: "0.875rem",
            }}
          >
            <ChevronLeft style={{ width: "1rem", height: "1rem" }} />
            Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    );
  }

  if (!ev) {
    return (
      <div
        style={{
          padding: "3rem 2rem",
          textAlign: "center",
          color: "var(--muted-foreground)",
        }}
      >
        <div className="loading-spinner" />
        <p style={{ marginTop: "1rem" }}>Chargement du planning…</p>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "2rem 1rem",
        maxWidth: "80rem",
        margin: "0 auto",
        width: "100%",
      }}
    >
      {/* Back + header */}
      <div style={{ marginBottom: "1.5rem" }}>
        <Link
          href={`/events/${ev.id}`}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.375rem",
            fontSize: "0.875rem",
            color: "var(--muted-foreground)",
            marginBottom: "1rem",
          }}
        >
          <ChevronLeft style={{ width: "1rem", height: "1rem" }} />
          {ev.title}
        </Link>
        <h1
          style={{
            fontSize: "clamp(1.5rem, 4vw, 2.25rem)",
            fontWeight: 700,
            letterSpacing: "-0.025em",
          }}
        >
          Planning
        </h1>
        <p
          style={{
            color: "var(--muted-foreground)",
            marginTop: "0.375rem",
            fontSize: "0.875rem",
          }}
        >
          {ev.sessions.length} session{ev.sessions.length > 1 ? "s" : ""}
        </p>
      </div>

      {/* Day tabs */}
      {days.length > 1 && (
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            flexWrap: "wrap",
            marginBottom: "1rem",
          }}
        >
          {days.map((d) => (
            <button
              key={d}
              onClick={() => setActiveDay(d)}
              style={{
                padding: "0.4rem 1rem",
                borderRadius: "9999px",
                border: "1px solid",
                borderColor:
                  activeDay && sameDay(d, activeDay)
                    ? "var(--primary)"
                    : "rgba(255,255,255,0.1)",
                background:
                  activeDay && sameDay(d, activeDay)
                    ? "rgba(124,92,252,0.2)"
                    : "transparent",
                color:
                  activeDay && sameDay(d, activeDay)
                    ? "var(--primary-glow)"
                    : "var(--muted-foreground)",
                fontSize: "0.875rem",
                fontWeight: 500,
                cursor: "pointer",
                transition: "all 0.2s",
                textTransform: "capitalize",
              }}
            >
              {fmtDay(d)}
            </button>
          ))}
        </div>
      )}

      {/* Track filter */}
      {tracks.length > 0 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            flexWrap: "wrap",
            marginBottom: "1.5rem",
          }}
        >
          <Filter
            style={{
              width: "0.875rem",
              height: "0.875rem",
              color: "var(--muted-foreground)",
            }}
          />
          {["all", ...tracks].map((t) => (
            <button
              key={t}
              onClick={() => setTrackFilter(t)}
              style={{
                padding: "0.2rem 0.7rem",
                borderRadius: "9999px",
                border: "1px solid",
                borderColor:
                  trackFilter === t
                    ? "var(--primary)"
                    : "rgba(255,255,255,0.08)",
                background:
                  trackFilter === t
                    ? "rgba(124,92,252,0.15)"
                    : "transparent",
                color:
                  trackFilter === t
                    ? "var(--primary-glow)"
                    : "var(--muted-foreground)",
                fontSize: "0.75rem",
                fontWeight: 500,
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              {t === "all" ? "Tous les tracks" : t}
            </button>
          ))}
        </div>
      )}

      {/* Sessions list */}
      {sessionsForDay.length === 0 ? (
        <div
          style={{
            padding: "3rem",
            textAlign: "center",
            color: "var(--muted-foreground)",
            background: "rgba(26,26,36,0.5)",
            borderRadius: "1rem",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          Aucune session pour ce filtre.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {sessionsForDay.map((s) => {
            const live = isLive(s, now);
            const fav = isFavorite(s.id);
            const speakerNames = s.speakers
              ?.map((sp) => sp.speaker.fullName)
              .join(", ");

            return (
              <div
                key={s.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "5rem 1fr",
                  gap: "1rem",
                  alignItems: "start",
                }}
              >
                {/* Time column */}
                <div
                  style={{
                    paddingTop: "1rem",
                    textAlign: "right",
                    fontSize: "0.8rem",
                    color: "var(--muted-foreground)",
                    fontVariantNumeric: "tabular-nums",
                    lineHeight: 1.4,
                  }}
                >
                  <div style={{ fontWeight: 600, color: live ? "#ff4444" : "inherit" }}>
                    {fmt(s.startTime)}
                  </div>
                  <div>–{fmt(s.endTime)}</div>
                </div>

                {/* Card */}
                <Link href={`/sessions/${s.id}`} style={{ textDecoration: "none" }}>
                  <div
                    style={{
                      padding: "1rem 1.25rem",
                      borderRadius: "0.875rem",
                      border: `1px solid ${live ? "rgba(255,68,68,0.4)" : "rgba(255,255,255,0.06)"}`,
                      background: live
                        ? "rgba(255,68,68,0.06)"
                        : "rgba(26,26,36,0.7)",
                      backdropFilter: "blur(8px)",
                      transition: "all 0.2s",
                      cursor: "pointer",
                      boxShadow: live ? "0 0 20px rgba(255,68,68,0.1)" : "none",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLDivElement).style.transform =
                        "translateY(-2px)";
                      (e.currentTarget as HTMLDivElement).style.boxShadow =
                        "0 4px 24px rgba(0,0,0,0.3)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLDivElement).style.transform = "";
                      (e.currentTarget as HTMLDivElement).style.boxShadow = live
                        ? "0 0 20px rgba(255,68,68,0.1)"
                        : "none";
                    }}
                  >
                    {/* Top row */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: "1rem",
                        flexWrap: "wrap",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          gap: "0.5rem",
                          flexWrap: "wrap",
                          alignItems: "center",
                        }}
                      >
                        {live && <LiveBadge />}
                        {s.track && (
                          <Badge variant="secondary">{s.track}</Badge>
                        )}
                      </div>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggle(s.id);
                        }}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: fav ? "#f059c8" : "var(--muted-foreground)",
                          fontSize: "1rem",
                          padding: "0 0.25rem",
                          flexShrink: 0,
                          transition: "color 0.2s",
                        }}
                        title={fav ? "Retirer des favoris" : "Ajouter aux favoris"}
                      >
                        {fav ? "★" : "☆"}
                      </button>
                    </div>

                    {/* Title */}
                    <h3
                      style={{
                        marginTop: "0.5rem",
                        fontWeight: 600,
                        fontSize: "1rem",
                        lineHeight: 1.4,
                        color: "var(--foreground)",
                      }}
                    >
                      {s.title}
                    </h3>

                    {/* Description */}
                    {s.description && (
                      <p
                        style={{
                          marginTop: "0.3rem",
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

                    {/* Meta row */}
                    <div
                      style={{
                        marginTop: "0.625rem",
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "0.75rem",
                        fontSize: "0.75rem",
                        color: "var(--muted-foreground)",
                      }}
                    >
                      {s.room && (
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.3rem",
                          }}
                        >
                          <MapPin
                            style={{ width: "0.8rem", height: "0.8rem" }}
                          />
                          {s.room.name}
                        </span>
                      )}
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.3rem",
                        }}
                      >
                        <Clock style={{ width: "0.8rem", height: "0.8rem" }} />
                        {fmt(s.startTime)} – {fmt(s.endTime)}
                      </span>
                    </div>

                    {/* Speakers */}
                    {speakerNames && (
                      <p
                        style={{
                          marginTop: "0.375rem",
                          fontSize: "0.75rem",
                          color: "var(--primary-glow)",
                          fontWeight: 500,
                        }}
                      >
                        {speakerNames}
                      </p>
                    )}
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
