import { socket } from "../index";

interface GridRes {
  answers: string[];
  closestWord: string;
  wordToFind: string;
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
