/**
 * useQuestions — questions stockées en base via le backend.
 */
"use client";

import { useCallback, useEffect, useState } from "react";
import { api, type ApiQuestion } from "@/lib/apiClient";

export function useQuestions(sessionId?: string) {
  const [questions, setQuestions] = useState<ApiQuestion[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!sessionId) return;
    setLoading(true);
    try {
      const data = await api.questions.listBySession(sessionId);
      setQuestions(data);
    } catch {
      // réseau indisponible
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    refresh();
    // Polling léger toutes les 10 s pour le mode live
    const interval = setInterval(refresh, 10_000);
    return () => clearInterval(interval);
  }, [refresh]);

  const add = useCallback(
    async (sId: string, content: string, authorName?: string) => {
      const q = await api.questions.create(sId, {
        content: content.trim().slice(0, 500),
        authorName: authorName?.trim() || undefined,
      });
      setQuestions((prev) => [...prev, q]);
    },
    []
  );

  const upvote = useCallback(async (qId: string) => {
    const updated = await api.questions.upvote(qId);
    setQuestions((prev) => prev.map((q) => (q.id === qId ? updated : q)));
  }, []);

  const sorted = [...questions].sort((a, b) => b.upvotes - a.upvotes);

  return { questions: sorted, add, upvote, loading };
}
