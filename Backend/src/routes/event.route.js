import { Router } from "express";
import {
    getAllEvents,
    getEventById,
    createEvent,
} from "../controllers/event.controller.js";

const router = Router();

router.get("/", getAllEvents);
router.get("/:id", getEventById);
router.post("/", createEvent);

export default router;