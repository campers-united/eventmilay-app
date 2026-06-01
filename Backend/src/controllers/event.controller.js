import prisma from "../lib/prisma.js";

export const getAllEvents = async (req, res) => {
  try {
    const [events, total] = await prisma.$transaction([
      prisma.event.findMany({ orderBy: { startDate: "asc" } }),
      prisma.event.count(),
    ]);
    res.setHeader("X-Total-Count", total);
    res.setHeader("Access-Control-Expose-Headers", "X-Total-Count");
    res.json(events);
  } catch { res.status(500).json({ error: "Erreur récupération événements" }); }
};

export const getEventById = async (req, res) => {
  try {
    const event = await prisma.event.findUnique({
      where: { id: req.params.id },
      include: {
        sessions: {
          include: { room: true, speakers: { include: { speaker: true }, orderBy: { sortOrder: "asc" } } },
          orderBy: { startTime: "asc" },
        },
      },
    });
    if (!event) return res.status(404).json({ error: "Événement introuvable" });
    res.json(event);
  } catch { res.status(500).json({ error: "Erreur récupération événement" }); }
};

export const createEvent = async (req, res) => {
  try {
    const { title, description, location, coverColor, startDate, endDate } = req.body;
    const event = await prisma.event.create({
      data: { title, description, location, coverColor, startDate: new Date(startDate), endDate: new Date(endDate) },
    });
    res.status(201).json(event);
  } catch (err) { res.status(500).json({ error: "Erreur création événement", detail: err.message }); }
};

export const updateEvent = async (req, res) => {
  try {
    const { title, description, location, coverColor, startDate, endDate } = req.body;
    const event = await prisma.event.update({
      where: { id: req.params.id },
      data: { title, description, location, coverColor,
        ...(startDate && { startDate: new Date(startDate) }),
        ...(endDate   && { endDate:   new Date(endDate)   }),
      },
    });
    res.json(event);
  } catch (err) {
    if (err.code === "P2025") return res.status(404).json({ error: "Événement introuvable" });
    res.status(500).json({ error: "Erreur mise à jour événement" });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    await prisma.event.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (err) {
    if (err.code === "P2025") return res.status(404).json({ error: "Événement introuvable" });
    res.status(500).json({ error: "Erreur suppression événement" });
  }
};
