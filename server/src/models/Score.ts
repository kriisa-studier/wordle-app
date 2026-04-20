import mongoose from "mongoose";

interface IScore {
  name: string;
  time: number;
  guesses: string[];
  wordLength: number;
  uniqueLetters: boolean;
  createdAt?: Date;
}

const scoreSchema = new mongoose.Schema<IScore>({
  name: { type: String, required: true },
  time: { type: Number, required: true },
  guesses: { type: [String], default: [] },
  wordLength: { type: Number, required: true },
  uniqueLetters: { type: Boolean, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Score = mongoose.model("Score", scoreSchema);

export { Score, IScore };
