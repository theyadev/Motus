import { getRandomWord } from "../Functions/utils";

export default class Grid {
    id: string;
    roomId: string;
    currentRound: number;
    maxRound: number;
    answers: string[];
    wordToFind: string;
    closestWord: string;
    playerIndex: number;
    finished: boolean;
    currentTurn: number;
    time: number;
    
  
    constructor(id: string, roomId: string, wordToFind: string) {
      this.id = id;
      this.roomId = roomId;
      this.answers = [];
      this.wordToFind = wordToFind;
      this.closestWord = ".".repeat(wordToFind.length);
      this.playerIndex = 0;
      this.finished = false;
      this.currentRound = 0;
      this.maxRound = 5;
      this.currentTurn = 0
      this.time = 0
    }
  
    // TODO: Trouver un meilleur nom !!!!!!!!!!
    send() {
      return {
        answers: this.answers,
        closestWord: this.closestWord,
        wordToFind: this.wordToFind,
        finished: this.finished,
        currentTurn: this.currentTurn,
        time: this.time
      };
    }

    nextTurn(length: number) {
      if (this.currentTurn < length) {
        this.currentTurn++;
      } else {
        this.currentTurn = 0;
      }
    }

    reset() {
      this.wordToFind = getRandomWord();
      this.closestWord = ".".repeat(this.wordToFind.length);
      this.answers = [];
      this.finished = false;
      this.currentTurn = 0
      this.time = 0
    }
  }