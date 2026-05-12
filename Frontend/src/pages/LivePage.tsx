"use client";

import { useEffect, useState } from "react";
import { api, type ApiSession } from "@/lib/apiClient";
import { SessionCard } from "@/components/SessionCard";
import { LiveBadge } from "@/components/LiveBadge";

export default function LivePage() {
  const [live, setLive] = useState<ApiSession[]>([]);

  const refresh = () => api.sessions.live().then(setLive).catch(() => {});

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, 10_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="px-4 sm:px-8 py-8 max-w-6xl mx-auto w-full">
      <div className="flex items-center gap-3 mb-2 animate-fade-in-up">
        <LiveBadge size="md" />
        <h1 className="font-display text-3xl font-bold tracking-tight text-shimmer">Sessions en direct</h1>
      </div>
      <p className="text-muted-foreground mb-8 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
        Posez vos questions et upvotez en temps réel.
      </p>

      {live.length === 0 ? (
        <div className="relative rounded-2xl border border-border/60 bg-card/50 p-10 text-center text-muted-foreground bg-aurora overflow-hidden animate-scale-in">
          <div className="relative z-10">Aucune session en direct pour l&apos;instant.</div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 stagger">
          {live.map((s) => <SessionCard key={s.id} session={s} />)}
        </div>
      )}
    </div>
  );
}
