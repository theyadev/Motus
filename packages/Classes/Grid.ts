export default class Grid {
    id: number;
    answers: string[];
    wordToFind: string;
    closestWord: string;
    playerIndex: number;
    finished: boolean;
  
    constructor(id: number, wordToFind: string) {
      this.id = id;
      this.answers = [];
      this.wordToFind = wordToFind;
      this.closestWord = ".".repeat(wordToFind.length);
      this.playerIndex = 0;
      this.finished = false;
    }
  
    // TODO: Trouver un meilleur nom !!!!!!!!!!
    send() {
      return {
        answers: this.answers,
        closestWord: this.closestWord,
        wordToFind: this.wordToFind,
        finished: this.finished,
      };
    }
  }