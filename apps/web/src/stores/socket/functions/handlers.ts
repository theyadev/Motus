/**
 * Rules for handlers:
 * - 1 function with 1 event receiver (socket.on).
 * - must have a callback
 */

import { socket } from "../index";

import Difficulty from "../../../../../../packages/Types/Difficulty";
import Player from "../../../../../../packages/Classes/Player";

export function onUserUpdate(callback: (users: Player[]) => void) {
  socket.on("PLAYERS", (newUsers) => {
    callback(newUsers);
  });
}

export function onDifficulty(callback: (difficulty: Difficulty) => void) {
  socket.on("DIFFICULTY", (difficulty: Difficulty) => {
    callback(difficulty);
  });
}

export function onGrid(callback: (gridId: string) => void) {
  socket.on("GRID", (gridId: string) => {
    callback(gridId);
  });
}

export function onRound(callback: (round: number) => void) {
  socket.on("ROUND", (round: number) => {
    callback(round);
  });
}

export function onStatus(callback: (status: string) => void) {
  socket.on("STATUS", (status: string) => {
    callback(status);
  });
}

export default {
  onUserUpdate,
  onDifficulty,
  onGrid,
  onRound,
  onStatus,
};
