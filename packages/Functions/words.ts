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
  if (!word) return;
  for (let i = 0; i < word.length; i++) {
    if (word[i] == grid.wordToFind[i]) {
      grid.closestWord = addAtIndex(grid.closestWord, i, word[i]);
    }
  }
}

export function addAtIndex(string: string, index: number, letter: string) {
  return (
    string.slice(0, index) + letter + string.slice(index + 1, string.length)
  );
}
