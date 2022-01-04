import Difficulty from "../../../../../../packages/Types/Difficulty";
import { socket } from "../index";

export default function onDifficulty(callback: (difficulty: Difficulty) => void) {
  socket.on("DIFFICULTY", (difficulty: Difficulty) => {
    callback(difficulty);
  });
}
