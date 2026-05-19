"use client";
import { useEffect, useState } from "react";

const KEY = "event_favorites";

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(KEY);
    if (stored) setFavorites(JSON.parse(stored));
  }, []);

  const toggle = (sessionId: string) => {
    setFavorites((prev) => {
      const next = prev.includes(sessionId)
        ? prev.filter((id) => id !== sessionId)
        : [...prev, sessionId];
      localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
  };

  const isFavorite = (sessionId: string) => favorites.includes(sessionId);

  return { favorites, toggle, isFavorite };
}
