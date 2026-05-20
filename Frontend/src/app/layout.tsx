import type { Metadata } from "next";
import AppLayout from "@/layouts/AppLayout";
import "./globals.css";

export const metadata: Metadata = {
  title: "EventMilay — Plateforme événementielle",
  description: "Planning multi-track, sessions live et Q&A temps réel.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}
