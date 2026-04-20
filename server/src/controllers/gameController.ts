import { Request, Response } from "express";
import { generateWord } from "../utils/wordLoader.js";
import getFeedback from "../utils/getFeedback.js";

let currentWord = "";
let startTime: number;

export const startGame = async (req: Request, res: Response): Promise<void> => {
  const { length = "5", unique = "false" } = req.query as {
    length?: string;
    unique?: string;
  };

  currentWord = await generateWord(parseInt(length), unique === "true");
  startTime = Date.now();
  console.log(currentWord);

  res.json({ success: true });
};

export const guessWord = (req: Request, res: Response): void => {
  const { guess } = req.body as { guess: string };

  const feedback = getFeedback(guess, currentWord);
  const correct = guess.toLowerCase() === currentWord;
  const time = Math.floor((Date.now() - startTime) / 1000);
  res.json({ feedback, correct, time });
};
