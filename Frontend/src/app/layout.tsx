import type { Metadata } from "next";
import AppLayout from "@/layouts/AppLayout";
import { Providers } from "@/app/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "EventFlow — Live event hub",
  description: "Planning, live sessions et intervenants pour vos événements tech en temps réel.",
  metadataBase: new URL("https://example.com"),
  openGraph: {
    title: "EventFlow",
    description: "Naviguez facilement votre événement avec planning, sessions live et Q&A.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body>
        <Providers>
          <AppLayout>{children}</AppLayout>
        </Providers>
      </body>
    </html>
  );
}
