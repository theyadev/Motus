import { Server, Socket } from "socket.io";

import Grid from "../../../../packages/Classes/Grid";
import Game from "../../../../packages/Classes/Game";
import Player from "../../../../packages/Classes/Player";

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

        disconnect(i, Grids, Game, io, socket);
      }
    }
  });

  socket.on("LEAVE GAME", async function (player: Player, id: string) {
    const game = Games.get("game:" + id);

    if (!game) return;

    const index = game.players.findIndex((p) => {
      return p.socketId == player.socketId;
    });

    disconnect(index, Grids, game, io, socket);
  });
}
