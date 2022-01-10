import Grid from "../../../../packages/Classes/Grid";
import Game from "../../../../packages/Classes/Game";

import { Server, Socket } from "socket.io";

export default function (
  io: Server,
  socket: Socket,
  Games: Map<string, Game>,
  Grids: Map<string, Grid>
) {
  socket.on("GET STATUS", (id: string) => {
    const game = Games.get(id);

    if (!game) return;

    socket.emit("STATUS", game.status);
  });

  socket.on("GET INFO", (id: string) => {
    const game = Games.get(id);

    if (!game) return;

    socket.emit("DIFFICULTY", game.difficulty);
    socket.emit("ROUND", game.maxRound);
  });

  socket.on("GET GRID DATA", (id) => {
    const grid = Grids.get(id);

    if (!grid) return;

    socket.emit("GRID DATA", grid.send());
  });
}
