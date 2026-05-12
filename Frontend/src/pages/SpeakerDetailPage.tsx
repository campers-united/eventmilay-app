"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, ExternalLink, Linkedin, Twitter } from "lucide-react";
import { Card } from "@/components/ui/card";
import { api, type ApiSpeakerDetail } from "@/lib/apiClient";
import { SessionCard } from "@/components/SessionCard";

export default function SpeakerDetailPage() {
  const params = useParams();
  const rawId = params?.speakerId;
  const speakerId = typeof rawId === "string" ? rawId : Array.isArray(rawId) ? rawId[0] : "";
  const [sp, setSp] = useState<ApiSpeakerDetail | null>(null);

  useEffect(() => {
    if (speakerId) api.speakers.get(speakerId).then(setSp).catch(console.error);
  }, [speakerId]);

  if (!sp) return <div className="p-10 text-muted-foreground">Chargement…</div>;

  const spSessions = sp.sessions.map((ss) => ss.session);

  return (
    <div className="px-4 sm:px-8 py-8 max-w-5xl mx-auto w-full">
      <Link href="/speakers" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Tous les intervenants
      </Link>

      <Card className="mt-4 p-6 sm:p-8 bg-card/70 backdrop-blur border-border/60 shadow-elegant">
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          {sp.photoUrl && (
            <Image
              src={sp.photoUrl}
              alt={sp.fullName}
              width={112}
              height={112}
              className="h-28 w-28 rounded-2xl object-cover ring-2 ring-border"
            />
          )}
          <div className="min-w-0 flex-1">
            <h1 className="font-display text-3xl font-bold tracking-tight">{sp.fullName}</h1>
            <p className="mt-3 text-muted-foreground">{sp.bio}</p>
            <div className="mt-4 flex flex-wrap gap-3">
              {sp.twitter && (
                <a href={sp.twitter} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-primary-glow hover:underline">
                  <Twitter className="h-4 w-4" /> Twitter
                </a>
              )}
              {sp.linkedin && (
                <a href={sp.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-primary-glow hover:underline">
                  <Linkedin className="h-4 w-4" /> LinkedIn
                </a>
              )}
              {sp.website && (
                <a href={sp.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-primary-glow hover:underline">
                  <ExternalLink className="h-4 w-4" /> Site web
                </a>
              )}
            </div>
          </div>
        </div>
      </Card>

      {spSessions.length > 0 && (
        <section className="mt-10">
          <h2 className="font-display text-xl font-semibold mb-4">Sessions</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {spSessions.map((s) => <SessionCard key={s.id} session={s} />)}
          </div>
        </section>
      )}
    </div>
  );
}
