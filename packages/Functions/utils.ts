import Game from "../Classes/Game";
import Grid from "../Classes/Grid";
import getWords from "./words";

const words = getWords();

export function generateSeed(
  duplicates: Map<string, Game> | Map<string, Grid>
) {
  let id = Math.floor(Math.random() * 1000000000);
  while (duplicates.has("grid:" + id) || duplicates.has("game:" + id)) {
    id = Math.floor(Math.random() * 1000000000);
  }

  return id;
}

export function getRandomWord() {
  return "banane"
  return words[Math.floor(Math.random() * (words.length - 1))];
}
