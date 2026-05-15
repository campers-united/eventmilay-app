"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { api, type ApiSpeaker } from "@/lib/apiClient";
import { Card } from "@/components/ui/card";

export default function SpeakersPage() {
  const [speakers, setSpeakers] = useState<ApiSpeaker[]>([]);

  useEffect(() => {
    api.speakers.list().then(setSpeakers).catch(console.error);
  }, []);

  return (
    <div className="px-4 sm:px-8 py-8 max-w-6xl mx-auto w-full">
      <h1 className="font-display text-3xl font-bold tracking-tight">Intervenants</h1>
      <p className="text-muted-foreground mt-1 mb-8">Découvrez les speakers et leurs sessions.</p>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {speakers.map((sp) => (
          <Link key={sp.id} href={`/speakers/${sp.id}`}>
            <Card className="p-5 bg-card/70 border-border/60 transition-smooth hover:-translate-y-0.5 hover:shadow-elegant h-full">
              <div className="flex items-center gap-4">
                <div className="relative h-16 w-16 overflow-hidden rounded-full ring-2 ring-border flex-shrink-0">
                  {sp.photoUrl ? (
                    <Image src={sp.photoUrl} alt={sp.fullName} fill className="object-cover" />
                  ) : (
                    <div className="h-full w-full bg-muted flex items-center justify-center text-xl font-bold">
                      {sp.fullName[0]}
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="font-display font-semibold text-lg">{sp.fullName}</p>
                </div>
              </div>
              <p className="mt-3 text-sm text-muted-foreground line-clamp-3">{sp.bio}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
