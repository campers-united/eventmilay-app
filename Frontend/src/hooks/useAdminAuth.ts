"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/apiClient";

const ADMIN_TOKEN_KEY = "eventflow-admin-token";

export function useAdminAuth() {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem(ADMIN_TOKEN_KEY) : null;
    setToken(saved);
    setLoading(false);
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    const response = await api.admin.login(username, password);
    localStorage.setItem(ADMIN_TOKEN_KEY, response.token);
    setToken(response.token);
    return response.token;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    setToken(null);
  }, []);

  return {
    token,
    loading,
    isAuthenticated: Boolean(token),
    login,
    logout,
  };
}
