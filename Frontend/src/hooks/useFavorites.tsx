"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { api } from "@/lib/apiClient";
import { getUserToken } from "@/lib/userToken";

const KEY = "event_favorites";

type FavoritesContextValue = {
  favorites: string[];
  toggle: (sessionId: string) => void;
  isFavorite: (sessionId: string) => boolean;
};

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

function readStored(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function writeStored(ids: string[]) {
  localStorage.setItem(KEY, JSON.stringify(ids));
}

function syncToBackend(sessionId: string, adding: boolean) {
  const userToken = getUserToken();
  if (adding) {
    api.favorites
      .add(sessionId, userToken)
      .catch(console.error);
  } else {
    api.favorites.remove(sessionId, userToken).catch(console.error);
  }
}

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const stored = readStored();
    setFavorites(stored);

    const userToken = getUserToken();
    for (const id of stored) {
      api.favorites.add(id, userToken).catch(() => {});
    }
  }, []);

  const toggle = useCallback((sessionId: string) => {
    const prev = readStored();
    const adding = !prev.includes(sessionId);
    const next = adding
      ? [...prev, sessionId]
      : prev.filter((id) => id !== sessionId);
    writeStored(next);
    setFavorites(next);
    syncToBackend(sessionId, adding);
  }, []);

  const isFavorite = useCallback(
    (sessionId: string) => favorites.includes(sessionId),
    [favorites]
  );

  return (
    <FavoritesContext.Provider value={{ favorites, toggle, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) {
    throw new Error("useFavorites must be used within FavoritesProvider");
  }
  return ctx;
}
