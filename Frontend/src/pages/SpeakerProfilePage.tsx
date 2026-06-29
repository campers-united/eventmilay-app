"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ChevronLeft,
  Globe,
  Twitter,
  Linkedin,
  Calendar,
  Clock,
  MapPin,
  Trophy,
  Sparkles,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { api, type ApiSpeakerDetail } from "@/lib/apiClient";

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function fmtTime(d: string) {
  return new Date(d).toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function SpeakerProfilePage() {
  const params = useParams();
  const speakerId =
    typeof params?.speakerId === "string" ? params.speakerId : "";

  const [speaker, setSpeaker] = useState<ApiSpeakerDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!speakerId) return;
    api.speakers
      .get(speakerId)
      .then(setSpeaker)
      .catch((e) => setError(String(e)))
      .finally(() => setLoading(false));
  }, [speakerId]);

  if (error) {
    return (
      <div className="px-4 sm:px-8 py-8 max-w-3xl mx-auto w-full text-center">
        <Card className="p-10 border-live/40">
          <p className="text-live font-semibold mb-2">
            Intervenant introuvable
          </p>
          <p className="text-muted-foreground text-sm mb-4">{error}</p>
          <Button asChild variant="outline" size="sm">
            <Link href="/speakers">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Retour aux intervenants
            </Link>
          </Button>
        </Card>
      </div>
    );
  }

  if (loading || !speaker) {
    return (
      <div className="px-4 sm:px-8 py-8 max-w-3xl mx-auto w-full text-center animate-fade-in-up">
        <div className="loading-spinner mx-auto" />
        <p className="text-muted-foreground mt-4">Chargement…</p>
      </div>
    );
  }

  const totalSessions = speaker.sessions?.length ?? 0;
  const uniqueEvents = new Set(
    speaker.sessions?.map((s) => s.session.event.id) ?? []
  ).size;

  return (
    <div className="px-4 sm:px-8 py-8 max-w-5xl mx-auto w-full animate-fade-in-up">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-gradient-primary opacity-[0.04] rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-gradient-to-br from-primary to-accent opacity-[0.03] rounded-full blur-3xl" />
      </div>

      {/* Back button */}
      <Button asChild variant="ghost" size="sm" className="mb-6 group">
        <Link href="/speakers">
          <ChevronLeft className="h-4 w-4 mr-1 transition-transform group-hover:-translate-x-0.5" />
          Tous les intervenants
        </Link>
      </Button>

      {/* Hero card */}
      <div className="relative mb-10">
        <div className="absolute -top-6 -right-6 w-64 h-64 bg-gradient-primary opacity-[0.08] rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-4 -left-4 w-48 h-48 bg-gradient-to-br from-primary to-accent opacity-[0.05] rounded-full blur-3xl pointer-events-none" />

        <Card className="relative overflow-hidden border-border/60 bg-card/50 backdrop-blur">
          {/* Animated gradient line at top */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary-glow to-transparent opacity-70" />

          <div className="p-8 sm:p-10">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
              {/* Avatar with glow */}
              <div className="relative flex-shrink-0 group">
                <div className="absolute inset-0 rounded-full bg-gradient-primary opacity-30 blur-xl group-hover:opacity-50 transition-opacity duration-500" />
                <div className="absolute -inset-1 rounded-full bg-gradient-primary opacity-20 blur-2xl group-hover:opacity-40 transition-opacity duration-500" />
                <div
                  className="relative w-32 h-32 sm:w-44 sm:h-44 rounded-full overflow-hidden bg-muted ring-2 ring-border/60 group-hover:ring-primary/40 transition-all duration-500"
                  style={{
                    background: speaker.photoUrl
                      ? undefined
                      : "linear-gradient(135deg, var(--primary), var(--accent))",
                  }}
                >
                  {speaker.photoUrl ? (
                    <img
                      src={speaker.photoUrl}
                      alt={speaker.fullName}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl font-bold text-white">
                      {speaker.fullName.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
              </div>

              {/* Info */}
              <div className="text-center sm:text-left flex-1 min-w-0">
                <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight mb-2">
                  <span className="text-gradient">{speaker.fullName}</span>
                </h1>

                {/* Stats */}
                <div className="flex flex-wrap justify-center sm:justify-start gap-3 mb-5">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-medium text-primary-glow">
                    <Trophy className="h-3.5 w-3.5" />
                    {totalSessions} session{totalSessions > 1 ? "s" : ""}
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-xs font-medium text-accent">
                    <Calendar className="h-3.5 w-3.5" />
                    {uniqueEvents} événement{uniqueEvents > 1 ? "s" : ""}
                  </div>
                </div>

                {speaker.bio && (
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {speaker.bio}
                  </p>
                )}

                {/* Social links */}
                <div className="flex flex-wrap justify-center sm:justify-start gap-3 mt-6">
                  {speaker.twitter && (
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="hover:border-primary/30 hover:text-primary-glow transition-all duration-300"
                    >
                      <a
                        href={
                          speaker.twitter.startsWith("http")
                            ? speaker.twitter
                            : `https://twitter.com/${speaker.twitter}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Twitter className="h-4 w-4 mr-1.5" />
                        Twitter
                      </a>
                    </Button>
                  )}
                  {speaker.linkedin && (
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="hover:border-primary/30 hover:text-primary-glow transition-all duration-300"
                    >
                      <a
                        href={
                          speaker.linkedin.startsWith("http")
                            ? speaker.linkedin
                            : `https://linkedin.com/in/${speaker.linkedin}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Linkedin className="h-4 w-4 mr-1.5" />
                        LinkedIn
                      </a>
                    </Button>
                  )}
                  {speaker.website && (
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="hover:border-primary/30 hover:text-primary-glow transition-all duration-300"
                    >
                      <a
                        href={
                          speaker.website.startsWith("http")
                            ? speaker.website
                            : `https://${speaker.website}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Globe className="h-4 w-4 mr-1.5" />
                        Site web
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Sessions section */}
      {totalSessions > 0 && (
        <div className="relative">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-primary/10 backdrop-blur-sm">
              <Sparkles className="h-5 w-5 text-primary-glow" />
            </div>
            <h2 className="font-display text-xl sm:text-2xl font-bold tracking-tight">
              <span className="text-gradient">Sessions</span>
            </h2>
          </div>

          <div className="space-y-4">
            {speaker.sessions.map((ss, i) => {
              const s = ss.session;
              return (
                <Link
                  key={s.id}
                  href={`/sessions/${s.id}`}
                  className="block group animate-fade-in-up"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <Card className="relative overflow-hidden border-border/60 bg-card/40 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:shadow-elegant hover:border-primary/30 hover:bg-card/70">
                    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="p-5 sm:p-6">
                      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                        {/* Date badge */}
                        <div className="flex-shrink-0 flex sm:flex-col items-center sm:items-center gap-1 sm:gap-0.5 px-3 sm:px-4 py-2 sm:py-3 rounded-xl bg-primary/5 border border-primary/10 min-w-[4rem] text-center">
                          <span className="text-xs uppercase tracking-wider text-muted-foreground">
                            {new Date(s.startTime)
                              .toLocaleDateString("fr-FR", { month: "short" })
                              .replace(".", "")}
                          </span>
                          <span className="text-xl sm:text-2xl font-bold text-primary-glow">
                            {new Date(s.startTime).getDate()}
                          </span>
                        </div>

                        {/* Session info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-semibold text-base sm:text-lg leading-snug group-hover:text-primary-glow transition-colors duration-300">
                              {s.title}
                            </h3>
                          </div>

                          {s.description && (
                            <p className="text-muted-foreground text-sm mt-1.5 line-clamp-2 leading-relaxed">
                              {s.description}
                            </p>
                          )}

                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3 text-xs text-muted-foreground">
                            <span className="inline-flex items-center gap-1">
                              <Calendar className="h-3.5 w-3.5" />
                              {fmtDate(s.startTime)}
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" />
                              {fmtTime(s.startTime)} – {fmtTime(s.endTime)}
                            </span>
                            {s.room && (
                              <span className="inline-flex items-center gap-1">
                                <MapPin className="h-3.5 w-3.5" />
                                {s.room.name}
                              </span>
                            )}
                          </div>

                          {/* Event badge */}
                          <div className="mt-3">
                            <Badge
                              variant="secondary"
                              className="text-[10px] tracking-wider uppercase border-border/40"
                            >
                              {s.event.title}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
