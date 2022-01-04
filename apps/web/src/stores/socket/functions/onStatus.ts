import { socket } from "../index";

export default function onStatus(callback: (status: string) => void) {
  socket.on("STATUS", (status: string) => {
    callback(status);
  });
}
