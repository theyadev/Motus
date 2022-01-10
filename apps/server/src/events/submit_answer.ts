import normalize from "../../../../packages/Functions/normalize";
import Grid from "../../../../packages/Classes/Grid";
import Game from "../../../../packages/Classes/Game";
import Player from "../../../../packages/Classes/Player";

import generateAnswer from "functions/generateAnswer";

import { Server, Socket } from "socket.io";
import { isInDictionary, updateClosestWord } from "../../../../packages/Functions/words";

export default function (
  io: Server,
  socket: Socket,
  Games: Map<string, Game>,
  Grids: Map<string, Grid>
) {
  socket.on("SUBMIT ANSWER", (id: string, answer: string, self: Player) => {
    const grid = Grids.get(id);

    if (!grid) return;

    if (grid.finished === true) return;

    const game = Games.get(grid.roomId);

    if (!game) return;

    const players = game.players.filter((p) => p.gridId == grid.id);

    const index = players.findIndex((p) => {
      return p.socketId == self.socketId;
    });

    if (grid.currentTurn != index) return;

    if (answer.length != grid.wordToFind.length) return;

    if (!isInDictionary(answer)) return

    grid.nextTurn(players.length);

    grid.answers.push(generateAnswer(grid.wordToFind, answer));

    if (normalize(answer) == normalize(grid.wordToFind)) {
      grid.finished = true;

      if (grid.currentRound < grid.maxRound - 1) {
        setTimeout(() => {
          grid.currentRound++;

          grid.reset();

          io.sockets.in(grid.id).emit("GRID DATA", grid.send());
        }, 2500);
      } else {
        if (game.interval) {
            clearInterval(game.interval)
   
            io.sockets.in(game.id).emit("PLAYERS", game.players);
            
            setTimeout(() => {
              game.status = "LEADERBOARD"
              io.sockets.in(game.id).emit("STATUS", game.status)
            }, 2000);

            setTimeout(() => {
              game.status = "MENU"
              io.sockets.in(game.id).emit("STATUS", game.status)
            }, 7000);
        }
     
      }
    }

    updateClosestWord(grid);

    socket.emit("ANSWER");

    grid.time = 0;

    io.sockets.in(grid.id).emit("GRID DATA", grid.send());
  });
}
