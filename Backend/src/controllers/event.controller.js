import prisma from "../lib/prisma.js";

// GET /api/events
export const getAllEvents = async (req, res) => {
  try {
    const events = await prisma.event.findMany({
      orderBy: { startDate: "asc" },
    });
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération des événements" });
  }
};


// GET /api/events/:id
export const getEventById = async (req, res) => {
  try {
    const event = await prisma.event.findUnique({
      where: { id: req.params.id },
      include: {
        sessions: {
          include: {
            room: true,
            speakers: { include: { speaker: true }, orderBy: { sortOrder: "asc" } },
          },
          orderBy: { startTime: "asc" },
        },
      },
    });
    if (!event) return res.status(404).json({ error: "Événement introuvable" });
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération de l'événement" });
  }
};
