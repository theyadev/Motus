import Grid from "../../../../packages/Classes/Grid";
import Game from "../../../../packages/Classes/Game";
import { Server, Socket } from "socket.io";

export default function (
  io: Server,
  socket: Socket,
  Games: Map<string, Game>,
  Grids: Map<string, Grid>
) {
  socket.on("UPDATE PLAYERS", (id: string) => {
    const game = Games.get(id);

    if (!game) return;

    io.sockets.in(game.id.toString()).emit("PLAYERS", game.players);
  });
}
