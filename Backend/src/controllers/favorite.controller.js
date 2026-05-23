import prisma from "../lib/prisma.js";

export const getFavorites = async (req, res) => {
  try {
    const { userToken } = req.query;
    if (!userToken) return res.status(400).json({ error: "userToken requis" });
    const favs = await prisma.favorite.findMany({
      where: { userToken },
      include: { session: { include: { room: true, speakers: { include: { speaker: true } } } } },
      orderBy: { createdAt: "desc" },
    });
    res.json(favs);
  } catch { res.status(500).json({ error: "Erreur récupération favoris" }); }
};

export const addFavorite = async (req, res) => {
  try {
    const { userToken, sessionId } = req.body;
    const fav = await prisma.favorite.upsert({
      where: { userToken_sessionId: { userToken, sessionId } },
      create: { userToken, sessionId },
      update: {},
    });
    res.status(201).json(fav);
  } catch (err) { res.status(500).json({ error: "Erreur ajout favori", detail: err.message }); }
};

export const removeFavorite = async (req, res) => {
  try {
    const { userToken } = req.query;
    await prisma.favorite.delete({
      where: { userToken_sessionId: { userToken, sessionId: req.params.sessionId } },
    });
    res.status(204).send();
  } catch (err) {
    if (err.code === "P2025") return res.status(404).json({ error: "Favori introuvable" });
    res.status(500).json({ error: "Erreur suppression favori" });
  }
};
