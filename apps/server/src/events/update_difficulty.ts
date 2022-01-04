import Grid from "../../../../packages/Classes/Grid";
import Game from "../../../../packages/Classes/Game";
import Difficulty from "../../../../packages/Types/Difficulty";

import { Server, Socket } from "socket.io";

export default function (
  io: Server,
  socket: Socket,
  Games: Map<string, Game>,
  Grids: Map<string, Grid>
) {
  socket.on("UPDATE DIFFICULTY", function (difficulty: Difficulty, id: string) {
    const game = Games.get(id);

    if (!game) return;

    game.difficulty = difficulty;

    io.sockets.in(id).emit("DIFFICULTY", difficulty);
  });
}
