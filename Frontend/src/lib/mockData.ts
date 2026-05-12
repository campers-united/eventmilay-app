import type { EventItem, Room, Session, Speaker, Question } from "./types";

// Anchor "now" so some sessions are always live during the demo.
const now = new Date();
const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 0, 0);
const iso = (d: Date) => d.toISOString();
const addMin = (d: Date, m: number) => new Date(d.getTime() + m * 60000);

export const speakers: Speaker[] = [
  {
    id: "sp1",
    fullName: "Hanta Rakoto",
    photoUrl: "https://i.pravatar.cc/300?img=47",
    bio: "Lead Engineer chez OrangeMG. Passionnée par les systèmes distribués et l'edge computing à Madagascar.",
    links: { twitter: "https://twitter.com", linkedin: "https://linkedin.com" },
  },
  {
    id: "sp2",
    fullName: "Rivo Andrianarivo",
    photoUrl: "https://i.pravatar.cc/300?img=12",
    bio: "Architecte cloud, conférencier international, fondateur de DevSpaceMG.",
    links: { linkedin: "https://linkedin.com" },
  },
  {
    id: "sp3",
    fullName: "Soa Rabe",
    photoUrl: "https://i.pravatar.cc/300?img=32",
    bio: "Designer produit. Travaille sur l'accessibilité et les interfaces multilingues.",
    links: { twitter: "https://twitter.com" },
  },
  {
    id: "sp4",
    fullName: "Tiana Rasolofo",
    photoUrl: "https://i.pravatar.cc/300?img=68",
    bio: "Data scientist, spécialiste IA générative et NLP malgache.",
    links: { website: "https://example.com" },
  },
  {
    id: "sp5",
    fullName: "Naina Andry",
    photoUrl: "https://i.pravatar.cc/300?img=15",
    bio: "DevRel chez Lovable. Communauté & open source.",
    links: { twitter: "https://twitter.com", linkedin: "https://linkedin.com" },
  },
];

export const rooms: Room[] = [
  { id: "r1", name: "Salle Indigo" },
  { id: "r2", name: "Salle Aurore" },
  { id: "r3", name: "Salle Nova" },
];

export const events: EventItem[] = [
  {
    id: "ev1",
    title: "DevConf Antananarivo 2026",
    description: "La plus grande conférence tech de l'océan Indien — IA, cloud, produit, communauté.",
    startDate: iso(today),
    endDate: iso(addMin(today, 60 * 10)),
    location: "Antananarivo, Madagascar",
    coverColor: "from-primary to-accent",
  },
  {
    id: "ev2",
    title: "Design Systems Summit",
    description: "Deux jours dédiés aux design systems, accessibilité et tooling.",
    startDate: iso(addMin(today, 60 * 24 * 14)),
    endDate: iso(addMin(today, 60 * 24 * 15)),
    location: "Tamatave, Madagascar",
    coverColor: "from-accent to-primary-glow",
  },
  {
    id: "ev3",
    title: "AI Builders Meetup",
    description: "Soirée demos et ateliers IA générative.",
    startDate: iso(addMin(today, 60 * 24 * 30)),
    endDate: iso(addMin(today, 60 * 24 * 30 + 240)),
    location: "Diego-Suarez, Madagascar",
    coverColor: "from-primary-glow to-primary",
  },
];

// Sessions for ev1 — spread across the day, two are LIVE around `now`
const sessionsRaw: Array<Omit<Session, "id" | "eventId">> = [
  { title: "Keynote : L'avenir du dev en Afrique", description: "Vision et retours d'expérience.", startTime: iso(addMin(today, 0)), endTime: iso(addMin(today, 45)), roomId: "r1", capacity: 400, speakerIds: ["sp2"], track: "Keynote" },
  { title: "Edge computing & latence", description: "Architectures pratiques pour réduire la latence.", startTime: iso(addMin(today, 60)), endTime: iso(addMin(today, 105)), roomId: "r1", capacity: 200, speakerIds: ["sp1"], track: "Cloud" },
  { title: "Design accessible multilingue", description: "Patterns d'i18n et a11y.", startTime: iso(addMin(today, 60)), endTime: iso(addMin(today, 105)), roomId: "r2", capacity: 150, speakerIds: ["sp3"], track: "Design" },
  // LIVE windows around now
  { title: "Live demo : NLP malgache", description: "Modèles open-source pour le malgache.", startTime: iso(addMin(now, -15)), endTime: iso(addMin(now, 30)), roomId: "r1", capacity: 200, speakerIds: ["sp4"], track: "IA" },
  { title: "Construire un design system de zéro", description: "Tokens, composants, gouvernance.", startTime: iso(addMin(now, -10)), endTime: iso(addMin(now, 35)), roomId: "r2", capacity: 150, speakerIds: ["sp3", "sp5"], track: "Design" },
  { title: "DevRel & communauté", description: "Faire grandir une communauté tech locale.", startTime: iso(addMin(now, 60)), endTime: iso(addMin(now, 105)), roomId: "r3", capacity: 120, speakerIds: ["sp5"], track: "Communauté" },
  { title: "Cloud à coût maîtrisé", description: "Patterns FinOps pour startups.", startTime: iso(addMin(now, 120)), endTime: iso(addMin(now, 165)), roomId: "r1", capacity: 200, speakerIds: ["sp2", "sp1"], track: "Cloud" },
  { title: "IA générative en production", description: "Évaluation, garde-fous, observabilité.", startTime: iso(addMin(now, 120)), endTime: iso(addMin(now, 165)), roomId: "r2", capacity: 180, speakerIds: ["sp4"], track: "IA" },
  { title: "Closing & networking", description: "Mot de la fin et apéro.", startTime: iso(addMin(now, 200)), endTime: iso(addMin(now, 260)), roomId: "r3", capacity: 400, speakerIds: ["sp2", "sp5"], track: "Keynote" },
];

export const sessions: Session[] = sessionsRaw.map((s, i) => ({
  ...s,
  id: `s${i + 1}`,
  eventId: "ev1",
}));

export const questions: Question[] = [
  { id: "q1", sessionId: "s4", content: "Quels datasets recommandez-vous pour démarrer en NLP malgache ?", authorName: "Mialy", upvotes: 12, createdAt: iso(addMin(now, -10)) },
  { id: "q2", sessionId: "s4", content: "Comment gérez-vous le code-switching français/malgache ?", upvotes: 7, createdAt: iso(addMin(now, -7)) },
  { id: "q3", sessionId: "s4", content: "Open-source des poids prévu ?", authorName: "Tahina", upvotes: 5, createdAt: iso(addMin(now, -3)) },
  { id: "q4", sessionId: "s5", content: "Quel outil pour gérer les tokens de design ?", authorName: "Lova", upvotes: 9, createdAt: iso(addMin(now, -5)) },
  { id: "q5", sessionId: "s5", content: "Comment convaincre les équipes produit d'adopter le DS ?", upvotes: 4, createdAt: iso(addMin(now, -2)) },
];

export const isLive = (s: Session, ref: Date = new Date()) => {
  const start = new Date(s.startTime).getTime();
  const end = new Date(s.endTime).getTime();
  return ref.getTime() >= start && ref.getTime() <= end;
};

export const getSpeaker = (id: string) => speakers.find((s) => s.id === id);
export const getRoom = (id: string) => rooms.find((r) => r.id === id);
export const getEvent = (id: string) => events.find((e) => e.id === id);
export const getSession = (id: string) => sessions.find((s) => s.id === id);