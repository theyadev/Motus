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

export function createGame() {
  socket.emit("CREATE GAME");

  return new Promise<string>((resolve, reject) => {
    socket.once("CREATED", (id: string) => {
        resolve(id)
    })

    setTimeout(() => {
        reject("Timeout")
    }, 5000);
  })
}

export default {
  leaveGame,
  startGame,
  createGame
};
