import readline from "node:readline";
import { createReadStream } from "node:fs";

const fileUrl = new URL("../../data/words.txt", import.meta.url);
export const wordsByLength = new Map<number, string[]>();
export const uniqueByLength = new Map<number, string[]>();

export let loaded = false;
export let loadingPromise: Promise<void> | null = null;

async function loadWords(): Promise<void> {
  if (loaded) return;
  if (loadingPromise) return loadingPromise;

  loadingPromise = (async () => {
    const stream = createReadStream(fileUrl, { encoding: "utf8" });
    const rl = readline.createInterface({
      input: stream,
      crlfDelay: Infinity,
    });

    for await (const line of rl) {
      const arr = wordsByLength.get(line.length);
      if (arr) arr.push(line);
      else wordsByLength.set(line.length, [line]);
    }

    loaded = true;
    loadingPromise = null;
  })();

  return loadingPromise;
}

export async function getWordsByLength(length: number): Promise<string[]> {
  await loadWords();
  return wordsByLength.get(length) ?? [];
}

export const generateWord = async (
  length: number,
  unique = false,
): Promise<string> => {
  const filteredWords = await getWordsByLength(length);
  if (unique) {
    let u = uniqueByLength.get(length);
    if (!u) {
      u = filteredWords.filter((w) => new Set(w).size == w.length);
      uniqueByLength.set(length, u);
    }
    if (u.length === 0) throw new Error("No matching words");
    return u[Math.floor(Math.random() * u.length)];
  }
  if (filteredWords.length === 0) throw new Error("No matching words");
  return filteredWords[Math.floor(Math.random() * filteredWords.length)];
};
