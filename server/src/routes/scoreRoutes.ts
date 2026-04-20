import express from "express";
import { saveScore, renderHighscores } from "../controllers/scoreController.js";

const router = express.Router();

router.post("/", saveScore);
router.get("/", renderHighscores);

export default router;
