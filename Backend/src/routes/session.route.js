import { Router } from "express";
import { getAllSessions, getLiveSessions, getSessionById, createSession, updateSession, deleteSession } from "../controllers/session.controller.js";
import { getQuestions, createQuestion } from "../controllers/question.controller.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
// Public
router.get("/live", getLiveSessions);
router.get("/", getAllSessions);
router.get("/:id", getSessionById);
router.get("/:sessionId/questions", getQuestions);
router.post("/:sessionId/questions", createQuestion);
// Protected
router.post("/", requireAuth, createSession);
router.put("/:id", requireAuth, updateSession);
router.delete("/:id", requireAuth, deleteSession);
export default router;
