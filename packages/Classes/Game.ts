import Difficulty from "../Types/Difficulty";
import Player from "./Player";

/**
 * FFA : One grid for all players.
 * FFFA : Fast Free For All. One grid per player with the same word.
 */
export type Mode = "FFA" | "FFA TEAM" | "BR" | "FFFA";

export type Status= "PLAYING" | "MENU" | "LEADERBOARD";

export default class Game {
  id: string;
  players: Player[];
  mode: Mode;
  currentRound: number;
  maxRound: number;
  playTime: number;
  status: Status;
  interval: undefined | NodeJS.Timer;
  difficulty: Difficulty;

  constructor(id: string) {
    this.id = id;
    this.players = [];
    this.mode = "FFA";
    this.currentRound = 0;
    this.maxRound = 5;
    this.playTime = 60;
    this.status = "MENU";
    this.difficulty = "Medium"
  }
}
