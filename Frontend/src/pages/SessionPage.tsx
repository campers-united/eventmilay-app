"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronLeft, Clock, MapPin, MessageSquare, ThumbsUp, Send } from "lucide-react";
import { api, type ApiSession, type ApiQuestion } from "@/lib/apiClient";
import { useNow } from "@/hooks/useNow";
import { useFavorites } from "@/hooks/useFavorites";
import { LiveBadge } from "@/components/LiveBadge";
import { Badge } from "@/components/ui/badge";

function fmt(d: string) {
  return new Date(d).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

export default function SessionPage() {
  const params = useParams();
  const sessionId =
    typeof params?.sessionId === "string"
      ? params.sessionId
      : Array.isArray(params?.sessionId)
      ? params.sessionId[0]
      : "";

  const [session, setSession] = useState<ApiSession | null>(null);
  const [questions, setQuestions] = useState<ApiQuestion[]>([]);
  const [newQ, setNewQ] = useState("");
  const [author, setAuthor] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const now = useNow();
  const { isFavorite, toggle } = useFavorites();

  useEffect(() => {
    if (!sessionId) return;
    api.sessions.get(sessionId).then(setSession).catch((e) => setError(String(e)));
    api.questions.list(sessionId).then(setQuestions).catch(() => {}); // Q&A optional
  }, [sessionId]);

  // Poll questions every 15s if session is live
  useEffect(() => {
    if (!sessionId) return;
    const id = setInterval(() => {
      api.questions.list(sessionId).then(setQuestions).catch(() => {});
    }, 15_000);
    return () => clearInterval(id);
  }, [sessionId]);

  const handleSubmitQuestion = async () => {
    if (!newQ.trim() || !sessionId) return;
    setSubmitting(true);
    try {
      const q = await api.questions.add(sessionId, newQ.trim(), author.trim() || undefined);
      setQuestions((prev) => [...prev, q]);
      setNewQ("");
    } catch {
      // Q&A endpoint might not exist yet
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpvote = async (qId: string) => {
    try {
      const updated = await api.questions.upvote(qId);
      setQuestions((prev) => prev.map((q) => (q.id === qId ? updated : q)));
    } catch {}
  };

  if (error) {
    return (
      <div style={{ padding: "3rem 2rem", maxWidth: "48rem", margin: "0 auto", textAlign: "center" }}>
        <div style={{ background: "rgba(255,68,68,0.1)", border: "1px solid rgba(255,68,68,0.3)", borderRadius: "1rem", padding: "2rem" }}>
          <p style={{ color: "#ff6666", fontWeight: 600, marginBottom: "0.5rem" }}>Session introuvable</p>
          <p style={{ color: "var(--muted-foreground)", fontSize: "0.875rem" }}>
            {error.includes("Failed to fetch") ? "Le backend n'est pas accessible." : error}
          </p>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", marginTop: "1.5rem", color: "var(--primary-glow)", fontSize: "0.875rem" }}>
            <ChevronLeft style={{ width: "1rem", height: "1rem" }} /> Retour
          </Link>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div style={{ padding: "3rem 2rem", textAlign: "center", color: "var(--muted-foreground)" }}>
        Chargement…
      </div>
    );
  }

  const live = new Date(session.startTime) <= now && new Date(session.endTime) >= now;
  const fav = isFavorite(session.id);
  const speakerNames = session.speakers?.map((sp) => sp.speaker.fullName).join(", ");
  const sortedQ = [...questions].sort((a, b) => b.upvotes - a.upvotes);

  return (
    <div style={{ padding: "2rem 1rem", maxWidth: "48rem", margin: "0 auto", width: "100%" }}>
      {/* Back */}
      <Link
        href={session.eventId ? `/events/${session.eventId}/planning` : "/"}
        style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem", fontSize: "0.875rem", color: "var(--muted-foreground)", marginBottom: "1.5rem" }}
      >
        <ChevronLeft style={{ width: "1rem", height: "1rem" }} /> Planning
      </Link>

      {/* Header card */}
      <div
        style={{
          padding: "1.5rem",
          borderRadius: "1rem",
          border: `1px solid ${live ? "rgba(255,68,68,0.4)" : "rgba(255,255,255,0.08)"}`,
          background: "rgba(26,26,36,0.8)",
          backdropFilter: "blur(12px)",
          boxShadow: live ? "0 0 32px rgba(255,68,68,0.1)" : "0 4px 32px rgba(0,0,0,0.3)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem" }}>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {live && <LiveBadge size="md" />}
            {session.track && <Badge variant="secondary">{session.track}</Badge>}
          </div>
          <button
            onClick={() => toggle(session.id)}
            style={{ background: "none", border: "none", cursor: "pointer", color: fav ? "#f059c8" : "var(--muted-foreground)", fontSize: "1.25rem", padding: "0.25rem", transition: "color 0.2s" }}
            title={fav ? "Retirer des favoris" : "Ajouter aux favoris"}
          >
            {fav ? "★" : "☆"}
          </button>
        </div>

        <h1 style={{ marginTop: "0.75rem", fontSize: "clamp(1.25rem, 3vw, 1.75rem)", fontWeight: 700, lineHeight: 1.3 }}>
          {session.title}
        </h1>

        {session.description && (
          <p style={{ marginTop: "0.75rem", color: "var(--muted-foreground)", lineHeight: 1.6 }}>
            {session.description}
          </p>
        )}

        <div style={{ marginTop: "1rem", display: "flex", flexWrap: "wrap", gap: "1rem", fontSize: "0.875rem", color: "var(--muted-foreground)" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem" }}>
            <Clock style={{ width: "1rem", height: "1rem" }} />
            {fmt(session.startTime)} – {fmt(session.endTime)}
          </span>
          {session.room && (
            <span style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem" }}>
              <MapPin style={{ width: "1rem", height: "1rem" }} />
              {session.room.name}
              {session.room.capacity && ` (${session.room.capacity} places)`}
            </span>
          )}
        </div>

        {speakerNames && (
          <p style={{ marginTop: "0.75rem", fontSize: "0.875rem", color: "var(--primary-glow)", fontWeight: 500 }}>
            🎤 {speakerNames}
          </p>
        )}
      </div>

      {/* Q&A section */}
      <div style={{ marginTop: "2rem" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
          <MessageSquare style={{ width: "1.25rem", height: "1.25rem", color: "var(--primary-glow)" }} />
          Questions &amp; Réponses
          {questions.length > 0 && (
            <span style={{ fontSize: "0.875rem", color: "var(--muted-foreground)", fontWeight: 400 }}>
              ({questions.length})
            </span>
          )}
        </h2>

        {/* Ask a question */}
        <div
          style={{
            padding: "1rem 1.25rem",
            borderRadius: "0.875rem",
            border: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(26,26,36,0.6)",
            marginBottom: "1rem",
          }}
        >
          <input
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Votre nom (optionnel)"
            style={{
              width: "100%",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "0.5rem",
              padding: "0.5rem 0.75rem",
              color: "var(--foreground)",
              fontSize: "0.875rem",
              marginBottom: "0.5rem",
              outline: "none",
            }}
          />
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <input
              value={newQ}
              onChange={(e) => setNewQ(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmitQuestion()}
              placeholder="Posez votre question…"
              style={{
                flex: 1,
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "0.5rem",
                padding: "0.5rem 0.75rem",
                color: "var(--foreground)",
                fontSize: "0.875rem",
                outline: "none",
              }}
            />
            <button
              onClick={handleSubmitQuestion}
              disabled={!newQ.trim() || submitting}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "0.5rem",
                background: "linear-gradient(135deg, #7c5cfc, #f059c8)",
                border: "none",
                color: "#fff",
                cursor: newQ.trim() ? "pointer" : "not-allowed",
                opacity: newQ.trim() ? 1 : 0.5,
                display: "flex",
                alignItems: "center",
                gap: "0.375rem",
                fontSize: "0.875rem",
                fontWeight: 500,
                transition: "opacity 0.2s",
              }}
            >
              <Send style={{ width: "0.875rem", height: "0.875rem" }} />
              Envoyer
            </button>
          </div>
        </div>

        {/* Questions list */}
        {sortedQ.length === 0 ? (
          <div
            style={{
              padding: "2rem",
              textAlign: "center",
              color: "var(--muted-foreground)",
              background: "rgba(26,26,36,0.4)",
              borderRadius: "0.875rem",
              border: "1px solid rgba(255,255,255,0.06)",
              fontSize: "0.875rem",
            }}
          >
            Aucune question pour l&apos;instant. Soyez le premier !
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
            {sortedQ.map((q) => (
              <div
                key={q.id}
                style={{
                  padding: "1rem 1.25rem",
                  borderRadius: "0.875rem",
                  border: "1px solid rgba(255,255,255,0.06)",
                  background: "rgba(26,26,36,0.6)",
                  display: "flex",
                  gap: "1rem",
                  alignItems: "flex-start",
                }}
              >
                <button
                  onClick={() => handleUpvote(q.id)}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "0.2rem",
                    background: "none",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "0.5rem",
                    padding: "0.375rem 0.625rem",
                    cursor: "pointer",
                    color: "var(--muted-foreground)",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    transition: "all 0.2s",
                    flexShrink: 0,
                    minWidth: "2.5rem",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--primary)";
                    (e.currentTarget as HTMLButtonElement).style.color = "var(--primary-glow)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.1)";
                    (e.currentTarget as HTMLButtonElement).style.color = "var(--muted-foreground)";
                  }}
                >
                  <ThumbsUp style={{ width: "0.875rem", height: "0.875rem" }} />
                  {q.upvotes}
                </button>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: "0.9375rem", lineHeight: 1.5 }}>{q.content}</p>
                  {q.authorName && (
                    <p style={{ marginTop: "0.25rem", fontSize: "0.75rem", color: "var(--muted-foreground)" }}>
                      — {q.authorName}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
