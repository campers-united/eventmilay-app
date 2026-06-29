"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { api, type ApiSpeaker } from "@/lib/apiClient";

export default function SpeakersPage() {
  const [speakers, setSpeakers] = useState<ApiSpeaker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.speakers
      .list()
      .then(setSpeakers)
      .catch((e) => setError(String(e)))
      .finally(() => setLoading(false));
  }, []);

  if (error) {
    return (
      <div className="px-4 sm:px-8 py-8 max-w-5xl mx-auto w-full text-center">
        <Card className="p-10 border-live/40">
          <p className="text-live font-semibold mb-2">Impossible de charger les intervenants</p>
          <p className="text-muted-foreground text-sm">
            {error.includes("Failed to fetch")
              ? "Le serveur backend n'est pas accessible."
              : error}
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-8 py-8 max-w-6xl mx-auto w-full">
      <div className="relative mb-10">
        <div className="absolute -top-10 -left-10 w-64 h-64 bg-gradient-primary opacity-[0.07] rounded-full blur-3xl pointer-events-none" />
        <div className="relative flex items-center gap-3 mb-2">
          <div className="p-2 rounded-xl bg-primary/10 backdrop-blur-sm">
            <Users className="h-5 w-5 text-primary-glow" />
          </div>
          <h1 className="font-display text-3xl font-bold tracking-tight">
            <span className="text-gradient">Intervenants</span>
          </h1>
        </div>
        <p className="text-muted-foreground ml-[3.25rem]">Découvrez tous les intervenants de l&apos;événement.</p>
      </div>

      {loading ? (
        <div className="text-center py-16 animate-fade-in-up">
          <div className="loading-spinner mx-auto" />
          <p className="text-muted-foreground mt-4">Chargement des intervenants…</p>
        </div>
      ) : speakers.length === 0 ? (
        <Card className="p-10 text-center border-border/60">
          <p className="text-muted-foreground">Aucun intervenant pour l&apos;instant.</p>
        </Card>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {speakers.map((s, i) => (
            <Link
              key={s.id}
              href={`/speakers/${s.id}`}
              className="block group animate-fade-in-up"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <Card className="p-6 border-border/60 bg-card/50 backdrop-blur transition-all duration-300 hover:-translate-y-1.5 hover:shadow-elegant hover:border-primary/30 hover:bg-card/70 h-full">
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-gradient-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md" />
                    <div
                      className="relative w-20 h-20 rounded-full overflow-hidden bg-muted ring-2 ring-border/60 group-hover:ring-primary/40 transition-all duration-300"
                      style={{
                        background: s.photoUrl
                          ? undefined
                          : "linear-gradient(135deg, var(--primary), var(--accent))",
                      }}
                    >
                      {s.photoUrl ? (
                        <img
                          src={s.photoUrl}
                          alt={s.fullName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xl font-bold text-white">
                          {s.fullName.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-base group-hover:text-primary-glow transition-colors duration-300">
                      {s.fullName}
                    </h3>
                    {s.bio && (
                      <p className="text-muted-foreground text-sm mt-1.5 line-clamp-2 leading-relaxed">
                        {s.bio}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
