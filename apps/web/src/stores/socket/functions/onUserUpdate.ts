import { socket } from "../index";
import Player from "../../../../../../packages/Classes/Player";

export default function onUserUpdate(callback: (users: Player[]) => void) {
  socket.on("PLAYERS", (newUsers) => {
    callback(newUsers);
  });
}
