import { Router } from "express";
import { getAllSpeakers, getSpeakerById, createSpeaker, updateSpeaker, deleteSpeaker } from "../controllers/speaker.controller.js";

const router = Router();

router.get("/", getAllSpeakers);
router.get("/:id", getSpeakerById);
router.post("/", createSpeaker);
router.put("/:id", updateSpeaker);
router.delete("/:id", deleteSpeaker);

export default router;
