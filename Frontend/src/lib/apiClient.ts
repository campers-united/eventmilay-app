// Backend runs on port 5000 with /api prefix (see Backend/src/server.js)
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export interface ApiEvent {
  id: string;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  location?: string;
  coverColor?: string;
}

export interface ApiSpeaker {
  id: string;
  fullName: string;
  photoUrl?: string;
  bio?: string;
  twitter?: string;
  linkedin?: string;
}

export interface ApiSession {
  id: string;
  eventId: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  track?: string;
  roomId?: string;
  room?: { id: string; name: string; capacity?: number };
  // Backend: speakers is SessionSpeaker[] with nested speaker object
  speakers?: Array<{ speaker: ApiSpeaker; sortOrder: number }>;
}

export interface ApiEventDetail extends ApiEvent {
  sessions: ApiSession[];
}

export interface ApiQuestion {
  id: string;
  sessionId: string;
  content: string;
  authorName?: string;
  upvotes: number;
  createdAt: string;
}

export interface ApiFavorite {
  userToken: string;
  sessionId: string;
  createdAt: string;
  session?: ApiSession;
}

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`);
  if (!res.ok) throw new Error(`API ${res.status} — ${path}`);
  return res.json();
}

async function post<T>(path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(`API ${res.status} — ${path}`);
  return res.json();
}

async function patchReq<T>(path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(`API ${res.status} — ${path}`);
  return res.json();
}

async function del<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, { method: "DELETE" });
  if (!res.ok) throw new Error(`API ${res.status} — ${path}`);
  return res.json();
}

export const api = {
  // GET /api/events  •  GET /api/events/:id
  events: {
    list: () => get<ApiEvent[]>("/api/events"),
    get: (id: string) => get<ApiEventDetail>(`/api/events/${id}`),
  },
  // Sessions come embedded in event detail; direct routes optional
  sessions: {
    get: (id: string) => get<ApiSession>(`/api/sessions/${id}`),
    live: () => get<ApiSession[]>("/api/sessions/live"),
  },
  // GET /api/speakers  •  GET /api/speakers/:id
  speakers: {
    list: () => get<ApiSpeaker[]>("/api/speakers"),
    get: (id: string) => get<ApiSpeaker>(`/api/speakers/${id}`),
  },
  // Questions — add route to backend if needed
  questions: {
    list: (sessionId: string) =>
      get<ApiQuestion[]>(`/api/sessions/${sessionId}/questions`),
    add: (sessionId: string, content: string, authorName?: string) =>
      post<ApiQuestion>(`/api/sessions/${sessionId}/questions`, { content, authorName }),
    upvote: (questionId: string) =>
      patchReq<ApiQuestion>(`/api/questions/${questionId}/upvote`),
  },
  // Favorites — add route to backend if needed
  favorites: {
    list: (userToken: string) =>
      get<ApiFavorite[]>(`/api/favorites?userToken=${userToken}`),
    add: (sessionId: string, userToken: string) =>
      post<ApiFavorite>("/api/favorites", { sessionId, userToken }),
    remove: (sessionId: string, userToken: string) =>
      del<{ success: boolean }>(`/api/favorites/${sessionId}?userToken=${userToken}`),
  },
};
