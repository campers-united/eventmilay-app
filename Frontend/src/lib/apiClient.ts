/**
 * apiClient.ts — Toutes les requêtes vers le backend Express (port 4000)
 * Le frontend tourne sur le port 3000 (Next.js dev), le backend sur 4000.
 * En production, mettez API_BASE dans .env.local ou dans next.config.
 */

export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "/api";

async function req<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers as Record<string, string> | undefined),
    },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.error ?? `HTTP ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

// ─── Events ──────────────────────────────────────────────────────────────────
export const api = {
  events: {
    list: () => req<ApiEvent[]>("/events"),
    get: (id: string) => req<ApiEventDetail>(`/events/${id}`),
  },

  sessions: {
    list: (params?: { eventId?: string; track?: string }) => {
      const qs = params
        ? "?" + new URLSearchParams(params as Record<string, string>).toString()
        : "";
      return req<ApiSession[]>(`/sessions${qs}`);
    },
    live: () => req<ApiSession[]>("/sessions/live"),
    get: (id: string) => req<ApiSessionDetail>(`/sessions/${id}`),
  },

  speakers: {
    list: () => req<ApiSpeaker[]>("/speakers"),
    get: (id: string) => req<ApiSpeakerDetail>(`/speakers/${id}`),
  },

  rooms: {
    list: () => req<ApiRoom[]>("/rooms"),
  },

  questions: {
    listBySession: (sessionId: string) =>
      req<ApiQuestion[]>(`/sessions/${sessionId}/questions`),
    create: (sessionId: string, body: { content: string; authorName?: string }) =>
      req<ApiQuestion>(`/sessions/${sessionId}/questions`, {
        method: "POST",
        body: JSON.stringify(body),
      }),
    upvote: (questionId: string) =>
      req<ApiQuestion>(`/questions/${questionId}/upvote`, { method: "POST" }),
  },

  favorites: {
    list: (userToken: string) =>
      req<ApiFavorite[]>(`/favorites?userToken=${userToken}`),
    add: (userToken: string, sessionId: string) =>
      req<ApiFavorite>("/favorites", {
        method: "POST",
        body: JSON.stringify({ userToken, sessionId }),
      }),
    remove: (userToken: string, sessionId: string) =>
      req<void>("/favorites", {
        method: "DELETE",
        body: JSON.stringify({ userToken, sessionId }),
      }),
  },
  admin: {
    login: (username: string, password: string) =>
      req<{ token: string }>("/admin/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      }),
    createSession: (token: string, payload: {
      eventId: string;
      roomId?: string | null;
      title: string;
      description?: string | null;
      track?: string | null;
      startTime: string;
      endTime: string;
      capacity?: number | null;
      speakerIds?: string[];
    }) =>
      req<ApiSession>("/sessions", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      }),
    createSpeaker: (token: string, payload: {
      fullName: string;
      photoUrl?: string | null;
      bio?: string | null;
      twitter?: string | null;
      linkedin?: string | null;
      website?: string | null;
    }) =>
      req<ApiSpeaker>("/speakers", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      }),
  },
};

// ─── API Types (shapes renvoyées par le backend) ──────────────────────────────

export interface ApiSpeaker {
  id: string;
  fullName: string;
  photoUrl?: string | null;
  bio?: string | null;
  twitter?: string | null;
  linkedin?: string | null;
  website?: string | null;
}

export interface ApiRoom {
  id: string;
  name: string;
  capacity?: number | null;
}

export interface ApiSessionSpeaker {
  sortOrder: number;
  speaker: ApiSpeaker;
}

export interface ApiSession {
  id: string;
  title: string;
  description?: string | null;
  startTime: string;
  endTime: string;
  track?: string | null;
  capacity?: number | null;
  eventId: string;
  roomId?: string | null;
  room?: ApiRoom | null;
  speakers: ApiSessionSpeaker[];
  event?: { id: string; title: string };
}

export interface ApiSessionDetail extends ApiSession {
  questions: ApiQuestion[];
}

export interface ApiEvent {
  id: string;
  title: string;
  description?: string | null;
  location?: string | null;
  coverColor?: string | null;
  startDate: string;
  endDate: string;
}

export interface ApiEventDetail extends ApiEvent {
  sessions: ApiSession[];
}

export interface ApiQuestion {
  id: string;
  sessionId: string;
  content: string;
  authorName?: string | null;
  upvotes: number;
  createdAt: string;
}

export interface ApiFavorite {
  userToken: string;
  sessionId: string;
  createdAt: string;
  session?: ApiSession;
}

export interface ApiSpeakerDetail extends ApiSpeaker {
  sessions: Array<{
    sortOrder: number;
    session: ApiSession;
  }>;
}
