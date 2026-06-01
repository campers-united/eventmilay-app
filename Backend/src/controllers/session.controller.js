import prisma from "../lib/prisma.js";

const include = {
  room: true,
  speakers: { include: { speaker: true }, orderBy: { sortOrder: "asc" } },
};

// GET /api/sessions
export const getAllSessions = async (req, res) => {
  try {
    const { eventId } = req.query;
    const where = eventId ? { eventId } : {};
    const sessions = await prisma.session.findMany({
      where,
      include,
      orderBy: { startTime: "asc" },
    });
    res.setHeader("X-Total-Count", sessions.length);
    res.setHeader("Access-Control-Expose-Headers", "X-Total-Count");
    res.json(sessions);
  } catch {
    res.status(500).json({ error: "Erreur récupération sessions" });
  }
};

// GET /api/sessions/live
export const getLiveSessions = async (req, res) => {
  try {
    const now = new Date();
    const sessions = await prisma.session.findMany({
      where: { startTime: { lte: now }, endTime: { gte: now } },
      include,
      orderBy: { startTime: "asc" },
    });
    res.setHeader("X-Total-Count", sessions.length);
    res.setHeader("Access-Control-Expose-Headers", "X-Total-Count");
    res.json(sessions);
  } catch {
    res.status(500).json({ error: "Erreur récupération sessions live" });
  }
};

// GET /api/sessions/:id
export const getSessionById = async (req, res) => {
  try {
    const session = await prisma.session.findUnique({
      where: { id: req.params.id },
      include,
    });
    if (!session) return res.status(404).json({ error: "Session introuvable" });
    res.json(session);
  } catch {
    res.status(500).json({ error: "Erreur récupération session" });
  }
};

// POST /api/sessions
export const createSession = async (req, res) => {
  try {
    const { eventId, roomId, title, description, track, startTime, endTime, capacity, speakerIds } = req.body;
    const session = await prisma.session.create({
      data: {
        eventId, roomId, title, description, track, capacity,
        capacity: capacity ? parseInt(capacity) : null,
startTime: new Date(startTime),
endTime: new Date(endTime),
        ...(speakerIds?.length && {
          speakers: {
            create: speakerIds.map((speakerId, i) => ({ speakerId, sortOrder: i })),
          },
        }),
      },
      include,
    });
    res.status(201).json(session);
  } catch (err) {
console.error("CREATE SESSION ERROR:", err);
res.status(500).json({ error: "Erreur création session", detail: err.message });  }
};

// PUT /api/sessions/:id
export const updateSession = async (req, res) => {
  try {
    const { roomId, title, description, track, startTime, endTime, capacity, speakerIds } = req.body;
    // Delete existing speakers then recreate
    if (speakerIds !== undefined) {
      await prisma.sessionSpeaker.deleteMany({ where: { sessionId: req.params.id } });
    }
    const session = await prisma.session.update({
      where: { id: req.params.id },
      data: {
        roomId, title, description, track,
capacity: capacity ? parseInt(capacity) : null,
        ...(startTime && { startTime: new Date(startTime) }),
        ...(endTime && { endTime: new Date(endTime) }),
        ...(speakerIds !== undefined && {
          speakers: {
            create: speakerIds.map((speakerId, i) => ({ speakerId, sortOrder: i })),
          },
        }),
      },
      include,
    });
    res.json(session);
  } catch (err) {
    if (err.code === "P2025") return res.status(404).json({ error: "Session introuvable" });
    res.status(500).json({ error: "Erreur mise à jour session", detail: err.message });
  }
};

// DELETE /api/sessions/:id
export const deleteSession = async (req, res) => {
  try {
    await prisma.session.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (err) {
    if (err.code === "P2025") return res.status(404).json({ error: "Session introuvable" });
    res.status(500).json({ error: "Erreur suppression session" });
  }
};
