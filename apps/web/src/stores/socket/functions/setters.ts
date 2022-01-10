/**
 * Rules for setters:
 * - 1 function with 1 emit.
 */

import { socket } from "../index";
import Player from "../../../../../../packages/Classes/Player";

export function leaveGame(player: Player, id: string) {
  socket.emit("LEAVE GAME", player, id);
}

export function startGame(id: string) {
  socket.emit("START GAME", id);
}

export default {
    leaveGame,
    startGame
}