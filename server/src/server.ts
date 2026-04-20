import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { fileURLToPath } from "node:url";
import path from "node:path";
import gameRoutes from "./routes/gameRoutes.js";
import scoreRoutes from "./routes/scoreRoutes.js";

dotenv.config();

const app = express();
app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URI!)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use("/api/game", gameRoutes);
app.use("/highscores", scoreRoutes);

const distPath = fileURLToPath(new URL("../../client/dist", import.meta.url));
app.use(express.static(distPath));

app.use((_, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

const PORT = 5080;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
