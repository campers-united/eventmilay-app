"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Clock, MapPin, ChevronLeft, Filter } from "lucide-react";
import { api, type ApiEventDetail, type ApiSession } from "@/lib/apiClient";
import { useNow } from "@/hooks/useNow";
import { useFavorites } from "@/hooks/useFavorites";
import { LiveBadge } from "@/components/LiveBadge";
import { Badge } from "@/components/ui/badge";

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

export default function Planning() {
  const params = useParams();
  const rawId = params?.eventId;
  const eventId =
    typeof rawId === "string" ? rawId : Array.isArray(rawId) ? rawId[0] : "";

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
    return Array.from(new Set(ev.sessions.map((s) => s.track).filter(Boolean))) as string[];
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
        padding: "3rem 1rem",
        maxWidth: "80rem",
        margin: "0 auto",
        width: "100%",
        background: "linear-gradient(135deg, rgba(124,92,252,0.05) 0%, rgba(0,0,0,0) 100%)",
        minHeight: "100vh",
      }}
    >
      <div style={{ marginBottom: "2.5rem" }}>
        <Link
          href={`/events/${ev.id}`}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.375rem",
            fontSize: "0.875rem",
            color: "var(--primary-glow)",
            marginBottom: "1.5rem",
            transition: "all 0.2s ease",
            opacity: 0.8,
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.opacity = "1";
            (e.currentTarget as HTMLAnchorElement).style.transform = "translateX(-4px)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.opacity = "0.8";
            (e.currentTarget as HTMLAnchorElement).style.transform = "translateX(0)";
          }}
        >
          <ChevronLeft style={{ width: "1rem", height: "1rem" }} />
          {ev.title}
        </Link>
        <h1
          style={{
            fontSize: "clamp(2rem, 5vw, 3rem)",
            fontWeight: 800,
            letterSpacing: "-0.035em",
            background: "linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.8) 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Planning de l&apos;événement
        </h1>
        <p
          style={{
            color: "var(--muted-foreground)",
            marginTop: "0.75rem",
            fontSize: "0.95rem",
            fontWeight: 500,
          }}
        >
          {ev.sessions.length} session{ev.sessions.length > 1 ? "s" : ""} disponible{ev.sessions.length > 1 ? "s" : ""}
        </p>
      </div>

      {days.length > 1 && (
        <div
          style={{
            display: "flex",
            gap: "0.75rem",
            flexWrap: "wrap",
            marginBottom: "2rem",
            padding: "1.25rem",
            background: "rgba(26,26,36,0.4)",
            borderRadius: "1.25rem",
            border: "1px solid rgba(124,92,252,0.15)",
            backdropFilter: "blur(10px)",
          }}
        >
          {days.map((d) => (
            <button
              key={d}
              onClick={() => setActiveDay(d)}
              style={{
                padding: "0.65rem 1.25rem",
                borderRadius: "0.875rem",
                border: "1px solid",
                borderColor:
                  activeDay && sameDay(d, activeDay)
                    ? "var(--primary)"
                    : "rgba(255,255,255,0.1)",
                background:
                  activeDay && sameDay(d, activeDay)
                    ? "linear-gradient(135deg, rgba(124,92,252,0.3) 0%, rgba(124,92,252,0.1) 100%)"
                    : "rgba(255,255,255,0.02)",
                color:
                  activeDay && sameDay(d, activeDay)
                    ? "var(--primary-glow)"
                    : "var(--muted-foreground)",
                fontSize: "0.9rem",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                textTransform: "capitalize",
              }}
              onMouseEnter={(e) => {
                if (!(activeDay && sameDay(d, activeDay))) {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(124,92,252,0.4)";
                  (e.currentTarget as HTMLButtonElement).style.background = "rgba(124,92,252,0.1)";
                  (e.currentTarget as HTMLButtonElement).style.color = "var(--primary-glow)";
                }
              }}
              onMouseLeave={(e) => {
                if (!(activeDay && sameDay(d, activeDay))) {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.1)";
                  (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.02)";
                  (e.currentTarget as HTMLButtonElement).style.color = "var(--muted-foreground)";
                }
              }}
            >
              {fmtDay(d)}
            </button>
          ))}
        </div>
      )}

      {tracks.length > 0 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            flexWrap: "wrap",
            marginBottom: "2rem",
            padding: "1rem 1.25rem",
            background: "rgba(26,26,36,0.3)",
            borderRadius: "1rem",
            border: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <Filter
            style={{
              width: "1rem",
              height: "1rem",
              color: "var(--primary-glow)",
              flexShrink: 0,
            }}
          />
          {["all", ...tracks].map((t) => (
            <button
              key={t}
              onClick={() => setTrackFilter(t)}
              style={{
                padding: "0.35rem 0.9rem",
                borderRadius: "0.75rem",
                border: "1px solid",
                borderColor:
                  trackFilter === t ? "var(--primary)" : "rgba(255,255,255,0.08)",
                background:
                  trackFilter === t
                    ? "linear-gradient(135deg, rgba(124,92,252,0.25) 0%, rgba(124,92,252,0.08) 100%)"
                    : "transparent",
                color:
                  trackFilter === t ? "var(--primary-glow)" : "var(--muted-foreground)",
                fontSize: "0.8rem",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.25s ease",
              }}
              onMouseEnter={(e) => {
                if (trackFilter !== t) {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(124,92,252,0.3)";
                  (e.currentTarget as HTMLButtonElement).style.background = "rgba(124,92,252,0.08)";
                  (e.currentTarget as HTMLButtonElement).style.color = "var(--primary-glow)";
                }
              }}
              onMouseLeave={(e) => {
                if (trackFilter !== t) {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.08)";
                  (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                  (e.currentTarget as HTMLButtonElement).style.color = "var(--muted-foreground)";
                }
              }}
            >
              {t === "all" ? "📋 Tous" : t}
            </button>
          ))}
        </div>
      )}

      {sessionsForDay.length === 0 ? (
        <div
          style={{
            padding: "4rem 2rem",
            textAlign: "center",
            color: "var(--muted-foreground)",
            background: "linear-gradient(135deg, rgba(124,92,252,0.08) 0%, rgba(0,0,0,0) 100%)",
            borderRadius: "1.5rem",
            border: "2px dashed rgba(124,92,252,0.2)",
          }}
        >
          <p style={{ fontSize: "1.1rem", fontWeight: 500 }}>😴 Aucune session pour ce filtre.</p>
          <p style={{ fontSize: "0.9rem", marginTop: "0.5rem", opacity: 0.7 }}>
            Essayez un autre jour ou un autre track.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {sessionsForDay.map((s) => {
            const live = isLive(s, now);
            const fav = isFavorite(s.id);
            const speakerNames = s.speakers?.map((sp) => sp.speaker.fullName).join(", ");

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
                <div
                  style={{
                    paddingTop: "0.75rem",
                    textAlign: "right",
                    fontSize: "0.85rem",
                    color: "var(--muted-foreground)",
                    fontVariantNumeric: "tabular-nums",
                    lineHeight: 1.5,
                    fontWeight: 500,
                  }}
                >
                  <div style={{ fontWeight: 700, color: live ? "#ff6b7a" : "var(--primary-glow)", fontSize: "0.95rem" }}>
                    {fmt(s.startTime)}
                  </div>
                  <div style={{ fontSize: "0.8rem", opacity: 0.8 }}>– {fmt(s.endTime)}</div>
                </div>

                <Link href={`/sessions/${s.id}`} style={{ textDecoration: "none" }}>
                  <div
                    style={{
                      padding: "1.5rem",
                      borderRadius: "1.25rem",
                      border: `2px solid ${
                        live ? "rgba(255,107,122,0.4)" : "rgba(124,92,252,0.2)"
                      }`,
                      background: live 
                        ? "linear-gradient(135deg, rgba(255,107,122,0.08) 0%, rgba(255,68,68,0.03) 100%)" 
                        : "linear-gradient(135deg, rgba(26,26,36,0.9) 0%, rgba(26,26,36,0.5) 100%)",
                      backdropFilter: "blur(10px)",
                      transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
                      cursor: "pointer",
                      boxShadow: live 
                        ? "0 8px 32px rgba(255,107,122,0.15), inset 0 1px 0 rgba(255,255,255,0.1)" 
                        : "0 4px 20px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.05)",
                      position: "relative",
                      overflow: "hidden",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
                      (e.currentTarget as HTMLDivElement).style.borderColor = live 
                        ? "rgba(255,107,122,0.6)" 
                        : "rgba(124,92,252,0.4)";
                      (e.currentTarget as HTMLDivElement).style.boxShadow = live
                        ? "0 12px 48px rgba(255,107,122,0.25), inset 0 1px 0 rgba(255,255,255,0.15)"
                        : "0 12px 48px rgba(124,92,252,0.15), inset 0 1px 0 rgba(255,255,255,0.1)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLDivElement).style.transform = "";
                      (e.currentTarget as HTMLDivElement).style.borderColor = live 
                        ? "rgba(255,107,122,0.4)" 
                        : "rgba(124,92,252,0.2)";
                      (e.currentTarget as HTMLDivElement).style.boxShadow = live
                        ? "0 8px 32px rgba(255,107,122,0.15), inset 0 1px 0 rgba(255,255,255,0.1)"
                        : "0 4px 20px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.05)";
                    }}
                  >
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
                          gap: "0.75rem",
                          flexWrap: "wrap",
                          alignItems: "center",
                        }}
                      >
                        {live && <LiveBadge />}
                        {s.track && (
                          <Badge 
                            variant="secondary" 
                            style={{
                              background: "linear-gradient(135deg, rgba(124,92,252,0.3), rgba(124,92,252,0.1))",
                              border: "1px solid rgba(124,92,252,0.3)",
                              fontWeight: 600,
                            }}
                          >
                            {s.track}
                          </Badge>
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
                          color: fav ? "#ff6b8a" : "rgba(255,255,255,0.4)",
                          fontSize: "1.25rem",
                          padding: "0 0.25rem",
                          flexShrink: 0,
                          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.3)";
                          (e.currentTarget as HTMLButtonElement).style.filter = "drop-shadow(0 4px 12px rgba(255,107,122,0.3))";
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.transform = "";
                          (e.currentTarget as HTMLButtonElement).style.filter = "";
                        }}
                        title={fav ? "Retirer des favoris" : "Ajouter aux favoris"}
                      >
                        {fav ? "★" : "☆"}
                      </button>
                    </div>

                    <h3
                      style={{
                        marginTop: "1rem",
                        fontWeight: 700,
                        fontSize: "1.1rem",
                        lineHeight: 1.5,
                        color: "var(--foreground)",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {s.title}
                    </h3>

                    {s.description && (
                      <p
                        style={{
                          marginTop: "0.75rem",
                          fontSize: "0.9rem",
                          color: "var(--muted-foreground)",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          lineHeight: 1.5,
                        }}
                      >
                        {s.description}
                      </p>
                    )}

                    <div
                      style={{
                        marginTop: "1.25rem",
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "1rem",
                        fontSize: "0.85rem",
                        color: "var(--muted-foreground)",
                        paddingTop: "1rem",
                        borderTop: "1px solid rgba(124,92,252,0.1)",
                      }}
                    >
                      {s.room && (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", fontWeight: 500 }}>
                          <MapPin style={{ width: "0.9rem", height: "0.9rem", color: "var(--primary-glow)" }} />
                          {s.room.name}
                        </span>
                      )}
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", fontWeight: 500 }}>
                        <Clock style={{ width: "0.9rem", height: "0.9rem", color: "var(--primary-glow)" }} />
                        {fmt(s.startTime)} – {fmt(s.endTime)}
                      </span>
                    </div>

                    {speakerNames && (
                      <p
                        style={{
                          marginTop: "0.75rem",
                          fontSize: "0.85rem",
                          color: "var(--primary-glow)",
                          fontWeight: 600,
                          letterSpacing: "0.3px",
                        }}
                      >
                        👤 {speakerNames}
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
