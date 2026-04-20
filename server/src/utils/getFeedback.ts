export type FeedbackResult = {
  letter: string;
  result: "correct" | "misplaced" | "incorrect";
};

export default function getFeedback(
  guess: string,
  correctWord: string,
): FeedbackResult[] {
  if (guess.length !== correctWord.length)
    throw new Error("Words are not of equal length");

  const result: FeedbackResult[] = [];
  const remainingLetters: Record<string, number> = {};

  for (let i = 0; i < correctWord.length; i++) {
    if (guess[i] === correctWord[i]) {
      result[i] = { letter: guess[i], result: "correct" };
    } else {
      const letter = correctWord[i];
      remainingLetters[letter] = (remainingLetters[letter] || 0) + 1;
    }
  }
  for (let i = 0; i < guess.length; i++) {
    if (result[i]) continue;
    const letter = guess[i];
    if (remainingLetters[letter]) {
      result[i] = { letter, result: "misplaced" };
      remainingLetters[letter]--;
    } else {
      result[i] = { letter, result: "incorrect" };
    }
  }

  return result;
}
