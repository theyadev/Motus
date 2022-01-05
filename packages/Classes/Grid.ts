import { getRandomWord } from "../Functions/words";
import Answer from "../Types/Answer";
import Difficulty from "../Types/Difficulty";
export default class Grid {
  id: string;
  roomId: string;
  currentRound: number;
  maxRound: number;
  difficulty: Difficulty;
  answers: Answer[];
  wordToFind: string;
  closestWord?: Answer;
  playerIndex: number;
  finished: boolean;
  currentTurn: number;
  time: number;

  constructor(id: string, roomId: string, wordToFind: string, maxRound: number, difficulty: Difficulty) {
    this.id = id;
    this.roomId = roomId;
    this.answers = [];
    this.wordToFind = wordToFind;
    this.playerIndex = 0;
    this.finished = false;
    this.currentRound = 0;
    this.maxRound = maxRound;
    this.difficulty = difficulty
    this.currentTurn = 0;
    this.time = 0;

    this.resetClosest();
  }

  resetClosest() {
    this.closestWord = {
      letters: [],
      correct: false,
    };

    for (let i = 0; i < this.wordToFind.length; i++) {
      this.closestWord.letters.push({
        char: ".",
        classe: "wrongLetter",
      });
    }

    for (let i = 0; i < 2; i++) {
      let index = Math.floor(Math.random()*this.closestWord.letters.length)

      this.closestWord.letters[index].char = this.wordToFind[index]
    }
    
  }

  // TODO: Trouver un meilleur nom !!!!!!!!!!
  send() {
    return {
      wordLength: this.wordToFind.length,
      closestWord: this.closestWord,
      answers: this.answers,
      finished: this.finished,
      currentTurn: this.currentTurn,
      time: this.time,
    };
  }

  nextTurn(length: number) {
    if (this.currentTurn < length - 1) {
      this.currentTurn++;
    } else {
      this.currentTurn = 0;
    }
  }

  reset() {
    this.wordToFind = getRandomWord(this.difficulty);
    this.answers = [];
    this.finished = false;
    this.currentTurn = 0;
    this.time = 0;
    this.resetClosest();
  }
}
