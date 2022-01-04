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
  socket.on("LEAVE GAME", async function (player: Player, id: string) {
    const gameId = "game:" + id
    
    const game = Games.get(gameId);

    if (!game) return;

    const index = game.players.findIndex((p) => {
      return p.socketId == player.socketId;
    });

    const removedPlayer = game.players.splice(index, 1)[0];

    if (removedPlayer.gridId) socket.leave(removedPlayer.gridId);

    socket.leave(gameId);

    io.sockets.in(gameId).emit("PLAYERS", game.players);
  });
}
