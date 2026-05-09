import prisma from "../lib/prisma.js";

// GET /api/speakers
export const getAllSpeakers = async (req, res) => {
  try {
    const speakers = await prisma.speaker.findMany({ orderBy: { fullName: "asc" } });
    res.json(speakers);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération des speakers" });
  }
};

// GET /api/speakers/:id
export const getSpeakerById = async (req, res) => {
  try {
    const speaker = await prisma.speaker.findUnique({
      where: { id: req.params.id },
      include: {
        sessions: {
          include: {
            session: {
              include: { event: { select: { id: true, title: true } }, room: true },
            },
          },
          orderBy: { sortOrder: "asc" },
        },
      },
    });
    if (!speaker) return res.status(404).json({ error: "Speaker introuvable" });
    res.json(speaker);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération du speaker" });
  }
};

// POST /api/speakers
export const createSpeaker = async (req, res) => {
  try {
    const { fullName, photoUrl, bio, twitter, linkedin, website } = req.body;
    const speaker = await prisma.speaker.create({
      data: { fullName, photoUrl, bio, twitter, linkedin, website },
    });
    res.status(201).json(speaker);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la création du speaker" });
  }
};

// PUT /api/speakers/:id
export const updateSpeaker = async (req, res) => {
  try {
    const { fullName, photoUrl, bio, twitter, linkedin, website } = req.body;
    const speaker = await prisma.speaker.update({
      where: { id: req.params.id },
      data: { fullName, photoUrl, bio, twitter, linkedin, website },
    });
    res.json(speaker);
  } catch (error) {
    if (error.code === "P2025") return res.status(404).json({ error: "Speaker introuvable" });
    res.status(500).json({ error: "Erreur lors de la mise à jour du speaker" });
  }
};

// DELETE /api/speakers/:id
export const deleteSpeaker = async (req, res) => {
  try {
    await prisma.speaker.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (error) {
    if (error.code === "P2025") return res.status(404).json({ error: "Speaker introuvable" });
    res.status(500).json({ error: "Erreur lors de la suppression du speaker" });
  }
};
