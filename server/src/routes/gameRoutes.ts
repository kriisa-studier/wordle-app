import express from "express";
import { startGame, guessWord } from "../controllers/gameController.js";

const router = express.Router();

router.get("/start", startGame);
router.post("/guess", guessWord);

export default router;
