import { socket } from "../index";

export default function getInfo(id: string) {
  socket.emit("GET INFO", id);
}
