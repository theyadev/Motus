import { socket } from "../index";

export default function startGame(id: string) {
  socket.emit("START GAME", id);
}
