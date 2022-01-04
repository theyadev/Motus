import { socket } from "../index";

export default function onRound(callback: (round: number) => void) {
  socket.on("ROUND", (round: number) => {
    callback(round);
  });
}
