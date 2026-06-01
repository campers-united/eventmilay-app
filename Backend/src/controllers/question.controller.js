import prisma from "../lib/prisma.js";

export const getQuestions = async (req, res) => {
  try {
    const questions = await prisma.question.findMany({
      where: { sessionId: req.params.sessionId },
      orderBy: [{ upvotes: "desc" }, { createdAt: "asc" }],
    });
    res.json(questions);
  } catch { res.status(500).json({ error: "Erreur récupération questions" }); }
};

export const createQuestion = async (req, res) => {
  try {
    const { content, authorName } = req.body;
    const q = await prisma.question.create({
      data: { sessionId: req.params.sessionId, content, authorName },
    });
    res.status(201).json(q);
  } catch (err) { res.status(500).json({ error: "Erreur création question", detail: err.message }); }
};

export const upvoteQuestion = async (req, res) => {
  try {
    const q = await prisma.question.update({
      where: { id: req.params.id },
      data: { upvotes: { increment: 1 } },
    });
    res.json(q);
  } catch (err) {
    if (err.code === "P2025") return res.status(404).json({ error: "Question introuvable" });
    res.status(500).json({ error: "Erreur upvote" });
  }
};

export const deleteQuestion = async (req, res) => {
  try {
    await prisma.question.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (err) {
    if (err.code === "P2025") return res.status(404).json({ error: "Question introuvable" });
    res.status(500).json({ error: "Erreur suppression question" });
  }
};
