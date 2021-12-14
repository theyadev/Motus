import getWords, {
  updateClosestWord,
} from "../../../../packages/Functions/words";
import normalize from "../../../../packages/Functions/normalize";
import Grid from "../../../../packages/Classes/Grid";
import Game from "../../../../packages/Classes/Game";
import { Server, Socket } from "socket.io";
import { getRandomWord } from "../../../../packages/Functions/utils";

const words = getWords();

export default function (
  io: Server,
  socket: Socket,
  Games: Map<string, Game>,
  Grids: Map<string, Grid>
) {
  socket.on("SUBMIT ANSWER", (id: string, answer: string) => {
    const grid = Grids.get(id);

    if (!grid) return;

    if (grid.finished === true) return;

    grid.answers.push(normalize(answer));

    if (answer == grid.wordToFind) {
      grid.finished = true;

      if (grid.currentRound < grid.maxRound) {
        setTimeout(() => {
          grid.currentRound++;

          grid.wordToFind = getRandomWord(words);
          grid.closestWord = ".".repeat(grid.wordToFind.length);
          grid.answers = [];
          grid.finished = false;

          io.sockets.in(grid.id).emit("GRID DATA", grid.send());
        }, 2500);
      }
    }

    updateClosestWord(grid);

    io.sockets.in(grid.id).emit("GRID DATA", grid.send());
  });
}
