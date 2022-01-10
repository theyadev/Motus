/**
 * Rule for updaters:
 * - 1 function with 1 emit. The emit must update something on the server
 */

import { socket } from "../index";

export function updateDifficulty(difficulty: string, id: string) {
  socket.emit("UPDATE DIFFICULTY", difficulty, id);
}

export function updateRound(round: string, id: string) {
  socket.emit("UPDATE ROUND", round, id);
}

export function updateUsers(id: string) {
  socket.emit("UPDATE PLAYERS", id);
}

export default {
  updateDifficulty,
  updateRound,
  updateUsers,
};
