import { socket } from "../index";

export default function onGrid(callback: (gridId: string) => void) {
  socket.on("GRID", (gridId: string) => {
    callback(gridId);
  });
}
