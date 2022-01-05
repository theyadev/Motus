import normalize from "./normalize";
import wordsList from "../words.json";
import Grid from "../Classes/Grid";
import Difficulty from "../Types/Difficulty";

function readWords(): string[] {
  return wordsList as string[];
}

export default function getWords() {
  const words = readWords();

  return words.map((word) => {
    return normalize(word);
  });
}

const words = getWords();

const DIFFICULTIES = {
  Easy: {
    min: 3,
    max: 5,
  },
  Medium: { min: 6, max: 7 },
  Hard: { min: 8, max: 10 },
  Impossible: { min: 11, max: 20 },
};

export function getRandomWord(difficulty: Difficulty) {
  const  { min, max } = DIFFICULTIES[difficulty]

  let filteredWords = words.filter((e) => {
    return e.length >= min && e.length <= max;
  });
  
  return filteredWords[Math.floor(Math.random() * (filteredWords.length - 1))];
}

export function updateClosestWord(grid: Grid) {
  const word = grid.answers.at(-1);
  if (!word || !grid.closestWord) return;
  for (let i = 0; i < word.letters.length; i++) {
    if (word.letters[i].char == grid.wordToFind[i]) {
      grid.closestWord.letters[i].char = word.letters[i].char;
      grid.closestWord.letters[i].classe = "wrongLetter";
    }
  }
}

export function isInDictionary(word: string) {
  if (words.includes(normalize(word))) return true;

  return false;
}
