import { socket } from "../index";
import Player from "../../../../../../packages/Classes/Player";

export default function leaveGame(player: Player, id: string) {
  socket.emit("LEAVE GAME", player, id);
}
