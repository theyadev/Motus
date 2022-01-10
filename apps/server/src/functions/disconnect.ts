import { Server, Socket } from "socket.io";
import Game from "../../../../packages/Classes/Game";
import Grid from "../../../../packages/Classes/Grid";
import Player from "../../../../packages/Classes/Player";

export default function disconnect(
  index: number,
  Grids: Map<string, Grid>,
  game: Game,
  io: Server,
  socket: Socket
) {
  const player = game.players.splice(index, 1)[0];

  if (player.gridId) {
    const grid = Grids.get(player.gridId);

    if (grid?.currentTurn == index) {
      grid.time = 0;
    }

    socket.leave(player.gridId);
  }

  socket.leave(game.id);

  io.sockets.in(game.id).emit("PLAYERS", game.players);
}
