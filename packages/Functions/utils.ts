import Game from "../Classes/Game";
import Grid from "../Classes/Grid";

export function generateSeed(duplicates: Map<number, Game> | Map<number, Grid>) {
    let id = Math.floor(Math.random() * 1000000000);
    while (duplicates.has(id)) {
      id = Math.floor(Math.random() * 1000000000);
    }
  
    return id;
  }

  export function getRandomWord(words: string[]) {
    return words[Math.floor(Math.random() * (words.length - 1))];
  }