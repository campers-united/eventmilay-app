"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronLeft, Globe, Twitter, Linkedin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api, type ApiSpeaker } from "@/lib/apiClient";

export default function SpeakerProfilePage() {
  const params = useParams();
  const speakerId = typeof params?.speakerId === "string" ? params.speakerId : "";

  const [speaker, setSpeaker] = useState<ApiSpeaker | null>(null);
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
          <p className="text-live font-semibold mb-2">Intervenant introuvable</p>
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

  return (
    <div className="px-4 sm:px-8 py-8 max-w-3xl mx-auto w-full animate-fade-in-up">
      <div className="relative mb-8">
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-gradient-primary opacity-[0.06] rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-gradient-to-br from-primary to-accent opacity-[0.04] rounded-full blur-3xl pointer-events-none" />

        <Button asChild variant="ghost" size="sm" className="mb-6">
          <Link href="/speakers">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Tous les intervenants
          </Link>
        </Button>

        <Card className="p-8 sm:p-10 border-border/60 bg-card/50 backdrop-blur relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-primary opacity-[0.04] rounded-full blur-2xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8">
            <div className="relative flex-shrink-0">
              <div className="absolute inset-0 rounded-full bg-gradient-primary opacity-40 blur-lg" />
              <div
                className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden bg-muted ring-2 ring-border/60"
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
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-white">
                    {speaker.fullName.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            </div>

            <div className="text-center sm:text-left flex-1 min-w-0">
              <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">
                <span className="text-gradient">{speaker.fullName}</span>
              </h1>

              {speaker.bio && (
                <p className="text-muted-foreground mt-4 leading-relaxed whitespace-pre-line">
                  {speaker.bio}
                </p>
              )}

              <div className="flex flex-wrap justify-center sm:justify-start gap-3 mt-6">
                {speaker.twitter && (
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="hover:border-primary/30 hover:text-primary-glow"
                  >
                    <a
                      href={speaker.twitter.startsWith("http") ? speaker.twitter : `https://twitter.com/${speaker.twitter}`}
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
                    className="hover:border-primary/30 hover:text-primary-glow"
                  >
                    <a
                      href={speaker.linkedin.startsWith("http") ? speaker.linkedin : `https://linkedin.com/in/${speaker.linkedin}`}
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
                    className="hover:border-primary/30 hover:text-primary-glow"
                  >
                    <a
                      href={speaker.website.startsWith("http") ? speaker.website : `https://${speaker.website}`}
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
        </Card>
      </div>
    </div>
  );
}
