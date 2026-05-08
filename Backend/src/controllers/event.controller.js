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

// POST /api/events
export const createEvent = async (req, res) => {
  try {
    const { title, description, location, coverColor, startDate, endDate } = req.body;
    const event = await prisma.event.create({
      data: { title, description, location, coverColor, startDate: new Date(startDate), endDate: new Date(endDate) },
    });
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la création de l'événement" });
  }
};
