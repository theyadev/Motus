import Grid from "../../../../packages/Classes/Grid";
import Game from "../../../../packages/Classes/Game";

import { Server, Socket } from "socket.io";
import Player from "../../../../packages/Classes/Player";

export default function (
  io: Server,
  socket: Socket,
  Games: Map<string, Game>,
  Grids: Map<string, Grid>
) {
  socket.on("LEAVE GAME", function (player: Player, id: string) {
    const game = Games.get("game:" + id);

    if (!game) return;

    const index = game.players.findIndex((p) => {
        return p.socketId == player.socketId
    })

    game.players.splice(index, 1)

    io.sockets.in("game:" + id).emit("PLAYERS", game.players);
  });
}
