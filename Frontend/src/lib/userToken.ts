/**
 * userToken.ts — identifiant anonyme persisté en localStorage.
 * Utilisé comme clé de favoris côté backend.
 */

const KEY = "eventflow:userToken";

export function getUserToken(): string {
  if (typeof window === "undefined") return "ssr";
  let token = localStorage.getItem(KEY);
  if (!token) {
    token = crypto.randomUUID();
    localStorage.setItem(KEY, token);
  }
  return token;
}
