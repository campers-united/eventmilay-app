import { Router } from "express";
import { upvoteQuestion, deleteQuestion } from "../controllers/question.controller.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
router.patch("/:id/upvote", upvoteQuestion);
router.delete("/:id", requireAuth, deleteQuestion);
export default router;
