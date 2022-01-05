import { generateSeed } from "../../../../packages/Functions/utils";
import { getRandomWord } from "../../../../packages/Functions/words";
import Grid from "../../../../packages/Classes/Grid";
import Game from "../../../../packages/Classes/Game";
import { Server, Socket } from "socket.io";

export default function (
  io: Server,
  socket: Socket,
  Games: Map<string, Game>,
  Grids: Map<string, Grid>
) {
  socket.on("START GAME", function (id: string) {
    const game = Games.get(id);

    if (!game) return;

    let word;

    switch (game.mode) {
      case "FFFA":
        word = getRandomWord(game.difficulty);

        for (const player of game.players) {
          const id = "grid:" + generateSeed(Grids);
          Grids.set(id, new Grid(id, game.id, word, game.maxRound, game.difficulty));

          player.gridId = id;
        }

        break;
      case "FFA":
        word = getRandomWord(game.difficulty);

        const id = "grid:" + generateSeed(Grids);
        Grids.set(id, new Grid(id, game.id, word, game.maxRound, game.difficulty));

        for (const player of game.players) {
          player.gridId = id;
          io.sockets.sockets.get(player.socketId)?.join(id);
        }
        break;
    }

    game.status = "PLAYING";

    for (const player of game.players) {
      const gridId = player.gridId;

      if (!gridId) continue;

      const grid = Grids.get(gridId);

      if (!grid) continue;

      io.to(player.socketId).emit("GRID", grid.id);
    }

    io.sockets.in(game.id).emit("STATUS", game.status);

    const gridIds = [
      ...new Set(
        game.players.map((p) => {
          return p.gridId;
        })
      ),
    ];

    if (gridIds == []) return;

    for (const gridId of gridIds) {
      if (!gridId) continue;

      const grid = Grids.get(gridId);

      if (!grid) continue;

      
      game.interval = setInterval(() => {
        const players = game.players.filter((p) => p.gridId == grid.id);
        
        if (grid.time > 10) {
          grid.nextTurn(players.length);
          grid.time = 0;
        }

        if (!grid.finished) {
          grid.time++;
        }

        io.sockets.in(grid.id).emit("GRID DATA", grid.send());
      }, 1000);
    }
  });
}
