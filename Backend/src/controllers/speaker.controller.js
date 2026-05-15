import prisma from "../lib/prisma.js";

export const getAllSpeakers = async (req, res) => {
  try {
    const [speakers, total] = await prisma.$transaction([
      prisma.speaker.findMany({ orderBy: { fullName: "asc" } }),
      prisma.speaker.count(),
    ]);
    res.setHeader("X-Total-Count", total);
    res.setHeader("Access-Control-Expose-Headers", "X-Total-Count");
    res.json(speakers);
  } catch { res.status(500).json({ error: "Erreur récupération intervenants" }); }
};

export const getSpeakerById = async (req, res) => {
  try {
    const speaker = await prisma.speaker.findUnique({ where: { id: req.params.id } });
    if (!speaker) return res.status(404).json({ error: "Intervenant introuvable" });
    res.json(speaker);
  } catch { res.status(500).json({ error: "Erreur récupération intervenant" }); }
};

export const createSpeaker = async (req, res) => {
  try {
    const { fullName, bio, photoUrl, twitter, linkedin, website } = req.body;
    const speaker = await prisma.speaker.create({ data: { fullName, bio, photoUrl, twitter, linkedin, website } });
    res.status(201).json(speaker);
  } catch (err) { res.status(500).json({ error: "Erreur création intervenant", detail: err.message }); }
};

export const updateSpeaker = async (req, res) => {
  try {
    const { fullName, bio, photoUrl, twitter, linkedin, website } = req.body;
    const speaker = await prisma.speaker.update({
      where: { id: req.params.id },
      data: { fullName, bio, photoUrl, twitter, linkedin, website },
    });
    res.json(speaker);
  } catch (err) {
    if (err.code === "P2025") return res.status(404).json({ error: "Intervenant introuvable" });
    res.status(500).json({ error: "Erreur mise à jour intervenant" });
  }
};

export const deleteSpeaker = async (req, res) => {
  try {
    await prisma.speaker.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (err) {
    if (err.code === "P2025") return res.status(404).json({ error: "Intervenant introuvable" });
    res.status(500).json({ error: "Erreur suppression intervenant" });
  }
};
