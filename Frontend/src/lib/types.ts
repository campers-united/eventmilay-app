export interface Speaker {
  id: string;
  fullName: string;
  photoUrl: string;
  bio: string;
  links: { twitter?: string; linkedin?: string; website?: string };
}

export interface Room {
  id: string;
  name: string;
}

export interface Question {
  id: string;
  content: string;
  authorName?: string;
  upvotes: number;
  sessionId: string;
  createdAt: string;
}

export interface Session {
  id: string;
  title: string;
  description: string;
  startTime: string; // ISO
  endTime: string;
  roomId: string;
  capacity: number;
  speakerIds: string[];
  eventId: string;
  track?: string;
}

export interface EventItem {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  coverColor: string;
}