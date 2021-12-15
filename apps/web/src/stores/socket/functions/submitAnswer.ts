import { socket } from "../index";
import Player from "../../../../../../packages/Classes/Player";

export default function submitAnswer(
  id: string,
  answer: string,
  self: Player,
  callback: () => void
) {
  socket.emit("SUBMIT ANSWER", id, answer, self);
  socket.on("ANSWER", () => {
    callback();
  });
}
