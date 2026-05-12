/**
 * useFavorites — favoris stockés en base via le backend.
 * userToken anonyme persisté dans localStorage pour identifier l'utilisateur.
 */
"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/apiClient";
import { getUserToken } from "@/lib/userToken";

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const token = getUserToken();
      const data = await api.favorites.list(token);
      setFavorites(data.map((f) => f.sessionId));
    } catch {
      // réseau indisponible
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const toggle = useCallback(
    async (sessionId: string) => {
      const token = getUserToken();
      const isFav = favorites.includes(sessionId);
      setFavorites((prev) =>
        isFav ? prev.filter((id) => id !== sessionId) : [...prev, sessionId]
      );
      try {
        if (isFav) {
          await api.favorites.remove(token, sessionId);
        } else {
          await api.favorites.add(token, sessionId);
        }
      } catch {
        setFavorites((prev) =>
          isFav ? [...prev, sessionId] : prev.filter((id) => id !== sessionId)
        );
      }
    },
    [favorites]
  );

  const isFavorite = useCallback(
    (id: string) => favorites.includes(id),
    [favorites]
  );

  return { favorites, toggle, isFavorite, loading };
}
