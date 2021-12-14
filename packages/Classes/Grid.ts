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