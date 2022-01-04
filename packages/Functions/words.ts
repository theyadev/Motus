import normalize from "./normalize";
import wordsList from "../words.json";
import Grid from "../Classes/Grid";

function readWords(): string[] {
  return wordsList as string[];
}

export default function getWords() {
  const words = readWords().filter(word => {
    return word.length < 10
  });

  return words.map((word) => {
    return normalize(word);
  });
}

const words = getWords();

export function getRandomWord() {
  // return "striée"
  return words[Math.floor(Math.random() * (words.length - 1))];
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

export function isInDictionary(word: string){
  if (words.includes(normalize(word))) return true

  return false
}