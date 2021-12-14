import Grid from "../../../../packages/Classes/Grid";
import Game from "../../../../packages/Classes/Game";
import { Server, Socket } from "socket.io";

export default function (
  io: Server,
  socket: Socket,
  Games: Map<string, Game>,
  Grids: Map<string, Grid>
) {
  socket.on("GET GRID DATA", (id) => {
    const grid = Grids.get(id);

    if (!grid) return;

    socket.emit("GRID DATA", grid.send());
  });
}
