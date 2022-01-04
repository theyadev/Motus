import { socket } from "../index";

export default function getStatus(id: string) {
  socket.emit("GET STATUS", id);
}
