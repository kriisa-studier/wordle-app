import { Request, Response } from "express";
import { Score, IScore } from "../models/Score.js";

export const saveScore = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = req.body as Partial<IScore> & {
      uniqueLetters?: string | boolean;
    };
    if (typeof data.uniqueLetters === "string") {
      data.uniqueLetters = data.uniqueLetters === "true";
    }
    const score = new Score(data);
    await score.save();
    res.json({ success: true });
  } catch (err) {
    console.log("Error saving score:", err);
    res.status(500).json({ error: "Failed to save score" });
  }
};

const escapeHtml = (s: string): string =>
  String(s).replace(
    /[&<>"']/g,
    (c) =>
      (
        ({ "&": "&", "<": "<", ">": ">", '"': '"', "'": "'" }) as Record<
          string,
          string
        >
      )[c],
  );

export const renderHighscores = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const scores = (await Score.find()
    .sort({ time: 1 })
    .limit(10)
    .lean()) as unknown as Array<IScore & { _id: any }>;

  let html = `
  <html>
  <head><title>Highscores</title><style>
  body { text-align: center; } table { margin: 20px auto; border-collapse: collapse; }
  th, td { padding: 8px 12px; }
  </style>
  </head>
  <body>
  <h1>Highscores</h1>
  <table>
  <tr>
  <th>Rank</th>
  <th>Name</th>
  <th>Time (s)</th>
  <th>Guesses</th>
  <th>Length</th>
  <th>Unique Letters</th>
  </tr>
  `;

  scores.forEach((s, i) => {
    html += `
    <tr>
    <td>${i + 1}</td>
    <td>${escapeHtml(String(s.name))}</td>
    <td>${s.time}</td>
    <td>${Array.isArray(s.guesses) ? s.guesses.join(", ") : escapeHtml(String(s.guesses || ""))}</td>
    <td>${s.wordLength}</td>
    <td>${s.uniqueLetters ? "Yes" : "No"}</td>
    </tr>`;
  });

  html += `</table><a href="/">Back to the Game</a></body></html>`;

  res.send(html);
};
