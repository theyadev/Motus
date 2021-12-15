import getWords, {
  updateClosestWord,
} from "../../../../packages/Functions/words";
import normalize from "../../../../packages/Functions/normalize";
import Grid from "../../../../packages/Classes/Grid";
import Game from "../../../../packages/Classes/Game";
import { Server, Socket } from "socket.io";
import { getRandomWord } from "../../../../packages/Functions/utils";
import Player from "../../../../packages/Classes/Player";
import Answer from "../../../../packages/Types/Answer";

function generateAnswer(wordToFind: string, word: string): Answer {
  let answer: Answer = {
    letters: [],
    correct: false
  }

  for (const l of word) {
    answer.letters.push({
      char: normalize(l),
      classe: 'wrongLetter'
    })
  }

  return answer
}

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
    if (answer.length != grid.wordToFind.length) return

    grid.nextTurn(players.length - 1);

    grid.answers.push(generateAnswer(grid.wordToFind, answer));

    if (answer == grid.wordToFind) {
      grid.finished = true;

      if (grid.currentRound < grid.maxRound) {
        setTimeout(() => {
          grid.currentRound++;

          grid.reset();

          io.sockets.in(grid.id).emit("GRID DATA", grid.send());
        }, 2500);
      }
    }

    updateClosestWord(grid);

    socket.emit("ANSWER");

    grid.time = 0

    io.sockets.in(grid.id).emit("GRID DATA", grid.send());
  });
}
