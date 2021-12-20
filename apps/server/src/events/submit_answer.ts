import { isInDictionary, updateClosestWord } from "../../../../packages/Functions/words";
import normalize from "../../../../packages/Functions/normalize";
import Grid from "../../../../packages/Classes/Grid";
import Game from "../../../../packages/Classes/Game";
import { Server, Socket } from "socket.io";
import Player from "../../../../packages/Classes/Player";
import Answer from "../../../../packages/Types/Answer";

/**
 * Convert a string to an Object of type Answer
 * @returns Answer
 */
function generateAnswer(wordToFind: string, word: string): Answer {
  // Normalize both
  word = normalize(word);
  wordToFind = normalize(wordToFind);

  // Create an empty Answer
  let answer: Answer = {
    letters: [],
    correct: true,
  };

  // Create our futre letter list, it will contains all letters of wordToFind
  let letterList = [];

  for (let i = 0; i < word.length; i++) {
    let classe = "wrongLetter";

    if (word[i] == wordToFind[i]) {
      // If they are the same letter, set the classe to correct
      classe = "correctLetter";
      // And push an empty letter
      letterList.push("");
    } else {
      if (answer.correct === true) answer.correct = false
      // Else push the letter in the letterList
      letterList.push(wordToFind[i]);
    }

    // Push the letter in the Answer, it'll just be wrong or correct
    answer.letters.push({
      char: word[i],
      classe,
    });
  }

  for (let i = 0; i < word.length; i++) {
    if (letterList.includes(word[i]) && word[i] != wordToFind[i]) {
      // Set the letter to near if letter in letter list and it's not a correct letter
      answer.letters[i].classe = "nearLetter";
      // remove the letter from the letterList
      letterList[i] = "";
    }
  }

  return answer;
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

    if (answer.length != grid.wordToFind.length) return;

    if (!isInDictionary(answer)) return

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

    grid.time = 0;

    io.sockets.in(grid.id).emit("GRID DATA", grid.send());
  });
}
