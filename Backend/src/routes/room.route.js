import { Router } from "express";
import { getAllRooms, getRoomById, createRoom, updateRoom, deleteRoom } from "../controllers/room.controller.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
router.get("/", getAllRooms);
router.get("/:id", getRoomById);
router.post("/", requireAuth, createRoom);
router.put("/:id", requireAuth, updateRoom);
router.delete("/:id", requireAuth, deleteRoom);
export default router;
