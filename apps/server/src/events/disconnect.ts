import Grid from "../../../../packages/Classes/Grid";
import Game from "../../../../packages/Classes/Game";

import { Server, Socket } from "socket.io";

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

        const player = Game.players.splice(i, 1);

        socket.leave(id)
        if (player[0].gridId) socket.leave(player[0].gridId)

        io.sockets.in(id).emit("PLAYERS", Game.players);
      }
    }
  });
}