"use client";

import Link from "next/link";
import { Star } from "lucide-react";
import { useEffect, useState } from "react";
import { useFavorites } from "@/hooks/useFavorites";
import { api, type ApiSession } from "@/lib/apiClient";
import { SessionCard } from "@/components/SessionCard";
import { Button } from "@/components/ui/button";
import { getUserToken } from "@/lib/userToken";

export default function FavoritesPage() {
  const { favorites } = useFavorites();
  const [favSessions, setFavSessions] = useState<ApiSession[]>([]);

  useEffect(() => {
    if (favorites.length === 0) { setFavSessions([]); return; }
    // Récupère les données complètes via /favorites?userToken=...
    api.favorites.list(getUserToken()).then((data) => {
      setFavSessions(data.filter((f) => f.session).map((f) => f.session as ApiSession));
    }).catch(console.error);
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
          <p className="text-muted-foreground mb-4">Aucune session favorite pour l&apos;instant.</p>
          <Button asChild className="bg-gradient-primary text-primary-foreground border-0">
            <Link href="/events/ev1/planning">Parcourir le planning</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {favSessions.map((s) => <SessionCard key={s.id} session={s} />)}
        </div>
      )}
    </div>
  );
}
