import { useState } from "react";

export default function GamePage() {
  const [guess, setGuess] = useState("");
  const [history, setHistory] = useState([]);
  const [won, setWon] = useState(false);
  const [name, setName] = useState("");
  const [wordLength, setWordLength] = useState(5);
  const [uniqueLetters, setUniqueLetters] = useState(false);
  const [finalTime, setFinalTime] = useState(null);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const startGame = async () => {
    await fetch(`/api/game/start?length=${wordLength}&unique=${uniqueLetters}`);
    setHistory([]);
    setWon(false);
    setGuess("");
  };

  const sendGuess = async () => {
    if (!guess) return;

    const res = await fetch("/api/game/guess", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ guess }),
    });

    const data = await res.json();
    setHistory([...history, data.feedback]);

    if (data.correct) {
      setWon(true);
      setFinalTime(data.time);
    }

    setGuess("");
  };

  const saveScore = async () => {
    if (saved || !name) return;
    setSaving(true);
    try {
      const res = await fetch("/highscores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          time: finalTime,
          guesses: history.map((h) => h.map((x) => x.letter).join("")),
                             wordLength,
                             uniqueLetters,
        }),
      });
      if (res.ok) setSaved(true);
      else {
        console.error("Save failed");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };
  return (
    <div style={{ maxWidth: 400, margin: "0 auto", textAlign: "center" }}>
      <h1>Wordle</h1>

      <div style={{ marginBottom: 10 }}>
        <label>
          Word Length:
          <input
            type="number"
            min="1"
            max="31"
            value={wordLength}
            onChange={(e) => {
              const value = e.target.value;
              setWordLength(value === "" ? "" : parseInt(value));
            }}
          />
        </label>
        <br />
        <label>
          Unique Letters:
          <input
            type="checkbox"
            checked={uniqueLetters}
            onChange={(e) => setUniqueLetters(e.target.checked)}
          />
        </label>
      </div>

      <button onClick={startGame}>Start New Game</button>

      <div>
        {history.map((row, i) => (
          <div key={i}>
            {row.map((l, j) => (
              <span
                key={j}
                style={{
                  alignItems: "center",
                  borderRadius: 2,
                  backgroundColor:
                    l.result === "correct"
                      ? "green"
                      : l.result === "misplaced"
                        ? "orange"
                        : "red",
                  display: "inline-grid",
                  height: 25,
                  width: 25,
                  margin: 2,
                  textTransform: "uppercase",
                }}
              >
                {l.letter}
              </span>
            ))}
          </div>
        ))}
      </div>

      {!won && (
        <div style={{ margin: "10px" }}>
          <input
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            placeholder="Guess Word"
          />
          <button onClick={sendGuess}>Guess</button>
        </div>
      )}

      {won && !saved && (
        <div>
        <input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        disabled={saving}
        />
        <button onClick={saveScore} disabled={saving || !name}>
        {saving ? "Saving..." : "Save Highscore"}
        </button>
        </div>
      )}
      {won && saved && <div>Score saved</div>}
    </div>
  );
}
