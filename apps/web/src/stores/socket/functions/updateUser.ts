import { socket } from "../index";

export default function updateUsers(id: string) {
  socket.emit("UPDATE PLAYERS", id);
}
