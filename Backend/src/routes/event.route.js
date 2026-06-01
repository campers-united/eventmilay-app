import { Router } from "express";
import { getAllEvents, getEventById, createEvent, updateEvent, deleteEvent } from "../controllers/event.controller.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
router.get("/",    getAllEvents);
router.get("/:id", getEventById);
router.post("/",      requireAuth, createEvent);
router.put("/:id",    requireAuth, updateEvent);
router.delete("/:id", requireAuth, deleteEvent);
export default router;
