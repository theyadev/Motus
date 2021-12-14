import {
  generateSeed,
} from "../../../../packages/Functions/utils";
import Grid from "../../../../packages/Classes/Grid";
import Game from "../../../../packages/Classes/Game";
import Player from "../../../../packages/Classes/Player";
import { Server, Socket } from "socket.io";

export default function (
  io: Server,
  socket: Socket,
  Games: Map<string, Game>,
  Grids: Map<string, Grid>
) {
  socket.on("CREATE GAME", function (username: string) {
    const id = "game:" + generateSeed(Games);

    const player = new Player(username, socket.id, true);
    const game = new Game(id, player);

    Games.set(id, game);

    socket.emit("CREATE", id);

    socket.join(id);
  });
}
