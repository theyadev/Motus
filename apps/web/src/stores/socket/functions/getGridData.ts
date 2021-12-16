import { socket } from "../index";
import Answer from "../../../../../../packages/Types/Answer";

interface GridRes {
  answers: Answer[];
  closestWord: Answer;
  wordLength: number;
  finished: boolean;
  currentTurn: number;
  time: number;
}

export default function getGridData(
  id: string,
  callback: (grid: GridRes) => void
) {
  socket.emit("GET GRID DATA", id);
  socket.on("GRID DATA", function (grid: GridRes) {
    callback(grid);
  });
}
