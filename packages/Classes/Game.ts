import Player from "./Player";

/**
 * FFA : One grid for all players.
 * FFFA : Fast Free For All. One grid per player with the same word.
 */
export type Mode = "FFA" | "FFA TEAM" | "BR" | "FFFA";

export type State = "IN GAME" | "MENU";

export default class Game {
  id: string;
  players: Player[];
  mode: Mode;
  state: State;
  currentRound: number;
  maxRound: number;
  playTime: number;

  constructor(id: string, host: Player) {
    this.id = id;
    this.players = [host];
    this.mode = "FFA";
    this.state = "MENU";
    this.currentRound = 0;
    this.maxRound = 5;
    this.playTime = 60;
  }
}
