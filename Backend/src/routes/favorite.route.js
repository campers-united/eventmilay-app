import { Router } from "express";
import { getFavorites, addFavorite, removeFavorite } from "../controllers/favorite.controller.js";

const router = Router();
router.get("/", getFavorites);
router.post("/", addFavorite);
router.delete("/:sessionId", removeFavorite);
export default router;
