const KEY = "event_user_token";

export function getUserToken(): string {
  if (typeof window === "undefined") return "ssr";
  let token = localStorage.getItem(KEY);
  if (!token) {
    token = `user_${Math.random().toString(36).slice(2)}`;
    localStorage.setItem(KEY, token);
  }
  return token;
}
