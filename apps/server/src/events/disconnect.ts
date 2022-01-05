import Grid from "../../../../packages/Classes/Grid";
import Game from "../../../../packages/Classes/Game";

import { Server, Socket } from "socket.io";
import disconnect from "../functions/disconnect";

export default function (
  io: Server,
  socket: Socket,
  Games: Map<string, Game>,
  Grids: Map<string, Grid>
) {
  socket.on("disconnect", function () {
    for (const game of Games) {
      const [id, Game] = game;

      for (let i = 0; i < Game.players.length; i++) {
        if (Game.players[i].socketId != socket.id) continue;

        const removedPlayer = Game.players.splice(i, 1)[0];

        disconnect(removedPlayer, i, Grids, Game, io, socket);
      }
    }
  });
}
