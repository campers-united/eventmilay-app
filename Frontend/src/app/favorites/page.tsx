"use client";

import Link from "next/link";
import { Star } from "lucide-react";
import { useEffect, useState } from "react";
import { useFavorites } from "@/hooks/useFavorites";
import { api, type ApiSession } from "@/lib/apiClient";
import { SessionCard } from "@/components/SessionCard";
import { Button } from "@/components/ui/button";
import { getUserToken } from "@/lib/userToken";

export default function Favorites() {
  const { favorites } = useFavorites();
  const [favSessions, setFavSessions] = useState<ApiSession[]>([]);
  const [browseEventId, setBrowseEventId] = useState<string | null>(null);

  useEffect(() => {
    api.events.list().then((data) => {
      if (data.length > 0) setBrowseEventId(data[0].id);
    });
  }, []);

  useEffect(() => {
    const userToken = getUserToken();
    // #region agent log
    fetch('http://127.0.0.1:7609/ingest/00a67ad0-b1f0-41fe-bc1e-b8a78678814b',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'924aaa'},body:JSON.stringify({sessionId:'924aaa',location:'favorites/page.tsx:useEffect',message:'favorites page load',data:{localFavorites:favorites,localCount:favorites.length,userToken},timestamp:Date.now(),hypothesisId:'B,E'})}).catch(()=>{});
    // #endregion
    if (favorites.length === 0) {
      setFavSessions([]);
      return;
    }
    api.favorites
      .list(userToken)
      .then((data) => {
        const sessions = data.filter((f) => f.session).map((f) => f.session as ApiSession);
        // #region agent log
        fetch('http://127.0.0.1:7609/ingest/00a67ad0-b1f0-41fe-bc1e-b8a78678814b',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'924aaa'},body:JSON.stringify({sessionId:'924aaa',location:'favorites/page.tsx:apiSuccess',message:'API favorites list response',data:{localCount:favorites.length,apiCount:data.length,sessionCount:sessions.length,apiSessionIds:data.map(f=>f.sessionId),localSessionIds:favorites},timestamp:Date.now(),hypothesisId:'B,D'})}).catch(()=>{});
        // #endregion
        setFavSessions(sessions);
      })
      .catch((err) => {
        // #region agent log
        fetch('http://127.0.0.1:7609/ingest/00a67ad0-b1f0-41fe-bc1e-b8a78678814b',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'924aaa'},body:JSON.stringify({sessionId:'924aaa',location:'favorites/page.tsx:apiError',message:'API favorites list failed',data:{error:String(err),localCount:favorites.length},timestamp:Date.now(),hypothesisId:'C'})}).catch(()=>{});
        // #endregion
        console.error(err);
      });
  }, [favorites]);

  return (
    <div className="px-4 sm:px-8 py-8 max-w-5xl mx-auto w-full">
      <div className="flex items-center gap-3 mb-2">
        <Star className="h-6 w-6 text-primary-glow fill-current" />
        <h1 className="font-display text-3xl font-bold tracking-tight">Mes favoris</h1>
      </div>
      <p className="text-muted-foreground mb-8">Synchronisés avec le serveur.</p>

      {favSessions.length === 0 ? (
        <div className="rounded-2xl border border-border/60 bg-card/50 p-10 text-center">
          <p className="text-muted-foreground mb-4">
            Aucune session favorite pour l&apos;instant.
          </p>
          <Button asChild className="bg-gradient-primary text-primary-foreground border-0">
            <Link href={browseEventId ? `/events/${browseEventId}/planning` : "/live"}>
              Parcourir le planning
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {favSessions.map((s) => (
            <SessionCard key={s.id} session={s} />
          ))}
        </div>
      )}
    </div>
  );
}
