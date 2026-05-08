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
