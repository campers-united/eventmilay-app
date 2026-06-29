import type { AppProps } from "next/app";
import { FavoritesProvider } from "@/hooks/useFavorites";
import "@/app/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <FavoritesProvider>
      <Component {...pageProps} />
    </FavoritesProvider>
  );
}
