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
    // #region agent log
    fetch('http://127.0.0.1:7609/ingest/00a67ad0-b1f0-41fe-bc1e-b8a78678814b',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'924aaa'},body:JSON.stringify({sessionId:'924aaa',location:'useFavorites.ts:add',message:'calling API add',data:{sessionId,userToken},timestamp:Date.now(),hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    api.favorites
      .add(sessionId, userToken)
      .then((res) => {
        // #region agent log
        fetch('http://127.0.0.1:7609/ingest/00a67ad0-b1f0-41fe-bc1e-b8a78678814b',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'924aaa'},body:JSON.stringify({sessionId:'924aaa',location:'useFavorites.ts:addOk',message:'API add success',data:{sessionId,result:res},timestamp:Date.now(),hypothesisId:'A'})}).catch(()=>{});
        // #endregion
      })
      .catch((err) => {
        // #region agent log
        fetch('http://127.0.0.1:7609/ingest/00a67ad0-b1f0-41fe-bc1e-b8a78678814b',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'924aaa'},body:JSON.stringify({sessionId:'924aaa',location:'useFavorites.ts:addErr',message:'API add failed',data:{sessionId,error:String(err)},timestamp:Date.now(),hypothesisId:'A,C'})}).catch(()=>{});
        // #endregion
        console.error(err);
      });
  } else {
    api.favorites.remove(sessionId, userToken).catch(console.error);
  }
}

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const stored = readStored();
    // #region agent log
    fetch('http://127.0.0.1:7609/ingest/00a67ad0-b1f0-41fe-bc1e-b8a78678814b',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'924aaa'},body:JSON.stringify({sessionId:'924aaa',location:'useFavorites.ts:init',message:'loaded from localStorage',data:{stored,count:stored.length},timestamp:Date.now(),hypothesisId:'E'})}).catch(()=>{});
    // #endregion
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
