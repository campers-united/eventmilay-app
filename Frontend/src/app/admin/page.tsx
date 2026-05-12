"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/apiClient";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import type { ApiEvent, ApiRoom, ApiSpeaker } from "@/lib/apiClient";

export default function AdminPage() {
  const { token, isAuthenticated, login, logout } = useAdminAuth();
  const [events, setEvents] = useState<ApiEvent[]>([]);
  const [rooms, setRooms] = useState<ApiRoom[]>([]);
  const [speakers, setSpeakers] = useState<ApiSpeaker[]>([]);
  const [loginState, setLoginState] = useState({ username: "", password: "", error: "" });
  const [speakerState, setSpeakerState] = useState({ fullName: "", photoUrl: "", bio: "", twitter: "", linkedin: "", website: "" });
  const [sessionState, setSessionState] = useState({ eventId: "", roomId: "", title: "", description: "", track: "", startTime: "", endTime: "", capacity: "", speakerIds: [] as string[] });
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) return;

    api.events.list().then(setEvents).catch(() => setEvents([]));
    api.rooms.list().then(setRooms).catch(() => setRooms([]));
    api.speakers.list().then(setSpeakers).catch(() => setSpeakers([]));
  }, [isAuthenticated]);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoginState((prev) => ({ ...prev, error: "" }));

    try {
      await login(loginState.username, loginState.password);
      setStatus("Connecté en tant qu'admin.");
    } catch (error) {
      setLoginState((prev) => ({ ...prev, error: "Identifiants invalides." }));
    }
  };

  const handleCreateSpeaker = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!token) return;

    try {
      await api.admin.createSpeaker(token, {
        fullName: speakerState.fullName,
        photoUrl: speakerState.photoUrl || undefined,
        bio: speakerState.bio || undefined,
        twitter: speakerState.twitter || undefined,
        linkedin: speakerState.linkedin || undefined,
        website: speakerState.website || undefined,
      });
      setSpeakerState({ fullName: "", photoUrl: "", bio: "", twitter: "", linkedin: "", website: "" });
      setStatus("Speaker créé avec succès.");
      api.speakers.list().then(setSpeakers);
    } catch (error) {
      setStatus("Impossible de créer le speaker.");
    }
  };

  const handleCreateSession = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!token) return;

    try {
      await api.admin.createSession(token, {
        eventId: sessionState.eventId || events[0]?.id || "",
        roomId: sessionState.roomId || null,
        title: sessionState.title,
        description: sessionState.description || undefined,
        track: sessionState.track || undefined,
        startTime: sessionState.startTime,
        endTime: sessionState.endTime,
        capacity: sessionState.capacity ? Number(sessionState.capacity) : undefined,
        speakerIds: sessionState.speakerIds,
      });
      setSessionState((prev) => ({ ...prev, title: "", description: "", track: "", startTime: "", endTime: "", capacity: "", speakerIds: [] }));
      setStatus("Session créée avec succès.");
      api.events.list().then(setEvents);
    } catch (error) {
      setStatus("Impossible de créer la session.");
    }
  };

  return (
    <div className="px-4 sm:px-8 py-8 max-w-6xl mx-auto w-full space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-3xl font-bold">Administration</h1>
        <p className="text-muted-foreground max-w-2xl">
          Connectez-vous pour créer des sessions et ajouter des speakers.
        </p>
      </div>

      {!isAuthenticated ? (
        <Card className="p-6 max-w-md mx-auto">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground">Utilisateur admin</label>
              <Input
                value={loginState.username}
                onChange={(event) => setLoginState((prev) => ({ ...prev, username: event.target.value }))}
                placeholder="admin"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground">Mot de passe</label>
              <Input
                type="password"
                value={loginState.password}
                onChange={(event) => setLoginState((prev) => ({ ...prev, password: event.target.value }))}
                placeholder="********"
              />
            </div>
            {loginState.error ? <p className="text-sm text-destructive">{loginState.error}</p> : null}
            <Button type="submit" className="w-full bg-gradient-primary text-primary-foreground border-0">
              Se connecter
            </Button>
          </form>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm text-muted-foreground">Vous êtes connecté en tant qu'administrateur.</p>
              {status ? <p className="text-sm text-foreground mt-1">{status}</p> : null}
            </div>
            <Button variant="outline" onClick={logout} className="text-sm">
              Déconnexion
            </Button>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-xl font-semibold">Créer un nouveau speaker</h2>
                <Badge variant="secondary">{speakers.length} speakers</Badge>
              </div>
              <form onSubmit={handleCreateSpeaker} className="space-y-4">
                <Input
                  value={speakerState.fullName}
                  onChange={(event) => setSpeakerState((prev) => ({ ...prev, fullName: event.target.value }))}
                  placeholder="Nom complet"
                  required
                />
                <Input
                  value={speakerState.photoUrl}
                  onChange={(event) => setSpeakerState((prev) => ({ ...prev, photoUrl: event.target.value }))}
                  placeholder="Photo URL"
                />
                <Textarea
                  value={speakerState.bio}
                  onChange={(event) => setSpeakerState((prev) => ({ ...prev, bio: event.target.value }))}
                  placeholder="Bio"
                  rows={3}
                />
                <Input
                  value={speakerState.twitter}
                  onChange={(event) => setSpeakerState((prev) => ({ ...prev, twitter: event.target.value }))}
                  placeholder="Twitter URL"
                />
                <Input
                  value={speakerState.linkedin}
                  onChange={(event) => setSpeakerState((prev) => ({ ...prev, linkedin: event.target.value }))}
                  placeholder="LinkedIn URL"
                />
                <Input
                  value={speakerState.website}
                  onChange={(event) => setSpeakerState((prev) => ({ ...prev, website: event.target.value }))}
                  placeholder="Site web"
                />
                <Button type="submit" className="bg-gradient-primary text-primary-foreground border-0">
                  Créer le speaker
                </Button>
              </form>
            </Card>

            <Card className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-xl font-semibold">Créer une nouvelle session</h2>
                <Badge variant="secondary">{events.length} événements</Badge>
              </div>
              <form onSubmit={handleCreateSession} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-sm text-muted-foreground">Événement</span>
                    <select
                      value={sessionState.eventId}
                      onChange={(event) => setSessionState((prev) => ({ ...prev, eventId: event.target.value }))}
                      className="mt-1 block w-full rounded-md border border-border/60 bg-background/80 px-3 py-2 text-sm"
                      required
                    >
                      <option value="">Sélectionner</option>
                      {events.map((event) => (
                        <option key={event.id} value={event.id}>{event.title}</option>
                      ))}
                    </select>
                  </label>
                  <label className="block">
                    <span className="text-sm text-muted-foreground">Salle</span>
                    <select
                      value={sessionState.roomId ?? ""}
                      onChange={(event) => setSessionState((prev) => ({ ...prev, roomId: event.target.value }))}
                      className="mt-1 block w-full rounded-md border border-border/60 bg-background/80 px-3 py-2 text-sm"
                    >
                      <option value="">Aucune</option>
                      {rooms.map((room) => (
                        <option key={room.id} value={room.id}>{room.name}</option>
                      ))}
                    </select>
                  </label>
                </div>
                <Input
                  value={sessionState.title}
                  onChange={(event) => setSessionState((prev) => ({ ...prev, title: event.target.value }))}
                  placeholder="Titre de la session"
                  required
                />
                <Textarea
                  value={sessionState.description}
                  onChange={(event) => setSessionState((prev) => ({ ...prev, description: event.target.value }))}
                  placeholder="Description"
                  rows={3}
                />
                <Input
                  value={sessionState.track}
                  onChange={(event) => setSessionState((prev) => ({ ...prev, track: event.target.value }))}
                  placeholder="Track"
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    type="datetime-local"
                    value={sessionState.startTime}
                    onChange={(event) => setSessionState((prev) => ({ ...prev, startTime: event.target.value }))}
                    required
                  />
                  <Input
                    type="datetime-local"
                    value={sessionState.endTime}
                    onChange={(event) => setSessionState((prev) => ({ ...prev, endTime: event.target.value }))}
                    required
                  />
                </div>
                <Input
                  type="number"
                  value={sessionState.capacity}
                  onChange={(event) => setSessionState((prev) => ({ ...prev, capacity: event.target.value }))}
                  placeholder="Capacité"
                />
                <label className="block">
                  <span className="text-sm text-muted-foreground">Speakers</span>
                  <select
                    multiple
                    value={sessionState.speakerIds}
                    onChange={(event) => {
                      const selected = Array.from(event.target.selectedOptions, (opt) => opt.value);
                      setSessionState((prev) => ({ ...prev, speakerIds: selected }));
                    }}
                    className="mt-1 block w-full min-h-40 rounded-md border border-border/60 bg-background/80 px-3 py-2 text-sm"
                  >
                    {speakers.map((speaker) => (
                      <option key={speaker.id} value={speaker.id}>{speaker.fullName}</option>
                    ))}
                  </select>
                </label>
                <Button type="submit" className="bg-gradient-primary text-primary-foreground border-0">
                  Créer la session
                </Button>
              </form>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
