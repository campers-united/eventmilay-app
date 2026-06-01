import prisma from "../lib/prisma.js";

export const getAllRooms = async (req, res) => {
  try {
    const rooms = await prisma.room.findMany({ orderBy: { name: "asc" } });
    res.setHeader("X-Total-Count", rooms.length);
    res.setHeader("Access-Control-Expose-Headers", "X-Total-Count");
    res.json(rooms);
  } catch { res.status(500).json({ error: "Erreur récupération salles" }); }
};

export const getRoomById = async (req, res) => {
  try {
    const room = await prisma.room.findUnique({ where: { id: req.params.id } });
    if (!room) return res.status(404).json({ error: "Salle introuvable" });
    res.json(room);
  } catch { res.status(500).json({ error: "Erreur récupération salle" }); }
};

export const createRoom = async (req, res) => {
  try {
    const { name, capacity } = req.body;
    const room = await prisma.room.create({ data: { name, capacity } });
    res.status(201).json(room);
  } catch (err) { res.status(500).json({ error: "Erreur création salle", detail: err.message }); }
};

export const updateRoom = async (req, res) => {
  try {
    const { name, capacity } = req.body;
    const room = await prisma.room.update({ where: { id: req.params.id }, data: { name, capacity } });
    res.json(room);
  } catch (err) {
    if (err.code === "P2025") return res.status(404).json({ error: "Salle introuvable" });
    res.status(500).json({ error: "Erreur mise à jour salle" });
  }
};

export const deleteRoom = async (req, res) => {
  try {
    await prisma.room.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (err) {
    if (err.code === "P2025") return res.status(404).json({ error: "Salle introuvable" });
    res.status(500).json({ error: "Erreur suppression salle" });
  }
};
