import normalize from "./normalize";
import words from "../words.json";
import Grid from "../Classes/Grid";

function readWords(): string[] {
  return words as string[];
}

export default function getWords() {
  const words = readWords();

  return words.map((word) => {
    return normalize(word);
  });
}

export function updateClosestWord(grid: Grid) {
  const word = grid.answers.at(-1);
  if (!word || !grid.closestWord) return;
  for (let i = 0; i < word.letters.length; i++) {
    if (word.letters[i].char == grid.wordToFind[i]) {
      grid.closestWord.letters[i].char = word.letters[i].char
      grid.closestWord.letters[i].classe = "wrongLetter"
    }
  }
}