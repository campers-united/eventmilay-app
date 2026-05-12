"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api, type ApiRoom, type ApiSession } from "@/lib/apiClient";
import { Card } from "@/components/ui/card";
import { LiveBadge } from "@/components/LiveBadge";
import { useNow } from "@/hooks/useNow";

function isLive(s: ApiSession, ref: Date) {
  return new Date(s.startTime) <= ref && new Date(s.endTime) >= ref;
}

export default function RoomsPage() {
  const now = useNow();
  const [rooms, setRooms] = useState<ApiRoom[]>([]);
  const [sessions, setSessions] = useState<ApiSession[]>([]);

  useEffect(() => {
    api.rooms.list().then(setRooms).catch(console.error);
    api.sessions.list().then(setSessions).catch(console.error);
  }, []);

  return (
    <div className="px-4 sm:px-8 py-8 max-w-6xl mx-auto w-full">
      <h1 className="font-display text-3xl font-bold tracking-tight">Salles</h1>
      <p className="text-muted-foreground mt-1 mb-8">Programmation chronologique par salle.</p>

      <div className="space-y-8">
        {rooms.map((room) => {
          const list = sessions
            .filter((s) => s.roomId === room.id)
            .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
          return (
            <section key={room.id}>
              <h2 className="font-display text-xl font-semibold mb-3">{room.name}</h2>
              <div className="grid gap-3">
                {list.map((s) => {
                  const live = isLive(s, now);
                  return (
                    <Link key={s.id} href={`/sessions/${s.id}`}>
                      <Card className={`p-4 flex items-center justify-between gap-4 bg-card/60 border-border/60 transition-smooth hover:border-primary/50 ${live ? "border-live/50" : ""}`}>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            {live && <LiveBadge />}
                            <span className="text-xs text-muted-foreground">
                              {new Date(s.startTime).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                              {" – "}
                              {new Date(s.endTime).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                            </span>
                          </div>
                          <p className="font-display font-semibold truncate">{s.title}</p>
                        </div>
                      </Card>
                    </Link>
                  );
                })}
                {list.length === 0 && <p className="text-sm text-muted-foreground">Aucune session.</p>}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
