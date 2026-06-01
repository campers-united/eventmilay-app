import { Router } from "express";
import { getAllSpeakers, getSpeakerById, createSpeaker, updateSpeaker, deleteSpeaker } from "../controllers/speaker.controller.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
router.get("/",    getAllSpeakers);
router.get("/:id", getSpeakerById);
router.post("/",        requireAuth, createSpeaker);
router.put("/:id",      requireAuth, updateSpeaker);
router.delete("/:id",   requireAuth, deleteSpeaker);
export default router;
