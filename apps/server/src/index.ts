import express from "express";
import helmet from "helmet";

import { Socket, Server } from "socket.io";

// Import Classes
import Player from "../../../packages/Classes/Player";
import Game from "../../../packages/Classes/Game";
import Grid from "../../../packages/Classes/Grid";

// Import Functions
import normalize from "../../../packages/Functions/normalize";
import getWords from "../../../packages/Functions/words";

import { getRandomWord, generateSeed } from "../../../packages/Functions/utils"

// Express Server
const app = express();

app.use(helmet());

const PORT = process.env.PORT || 8000;

const server = app.listen(PORT, () => {
  console.log("Server app listening on port " + PORT);
});

// SocketIO Server
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// Init Types
type Games = Map<number, Game>;
type Grids = Map<number, Grid>;

// Init Variables
const words = getWords();

let Games: Games = new Map();
let Grids: Grids = new Map();


io.on("connection", function (socket: Socket) {
  socket.on("START GAME", function (id: number) {
    const game = Games.get(id);

    if (!game) return;

    let word;

    switch (game.mode) {
      case "FFFA":
        word = getRandomWord(words);

        for (const player of game.players) {
          const id = generateSeed(Grids);
          Grids.set(id, new Grid(id, word));

          player.gridId = id;
        }

        break;
      case "FFA":
        word = getRandomWord(words);

        const id = generateSeed(Grids);
        Grids.set(id, new Grid(id, word));

        for (const player of game.players) {
          player.gridId = id;
          // TODO: JOIN le socket id de player dans "grid" + id
        }
        break;
    }

    for (const player of game.players) {
      const gridId = player.gridId;

      if (!gridId) continue;

      const grid = Grids.get(gridId);

      if (!grid) continue;

      io.to(player.socketId).emit("GRID", grid.id);
    }
  });

  socket.on("CREATE GAME", function (username: string) {
    const id = generateSeed(Games);

    const player = new Player(username, socket.id, true);
    const game = new Game(id, player);

    Games.set(id, game);

    socket.emit("CREATE", id);

    socket.join(id.toString());
  });

  socket.on("JOIN GAME", function (username: string, id: number) {
    const player = new Player(username, socket.id);

    const game = Games.get(id);

    if (!game) {
      return socket.emit("JOIN", false);
    }

    if (!game.players.some((p) => p.username == username)) {
      game.players.push(player);
      socket.emit("JOIN", true);

      socket.join(id.toString());
    } else {
      socket.emit("JOIN", false);
    }
  });

  socket.on("UPDATE PLAYERS", (id: number) => {
    const game = Games.get(id);

    if (!game) return;

    io.sockets.in(game.id.toString()).emit("PLAYERS", game.players);
  });

  socket.on("DOES GAME EXIST", function (id: number) {
    socket.emit("EXIST", Games.has(id));
  });

  socket.on("GET GRID DATA", (id) => {
    const grid = Grids.get(id);

    if (!grid) return;

    socket.emit("GRID DATA", grid.send());
  });

  function updateClosestWord(grid: Grid) {
    const word = grid.answers.at(-1);
    if (!word) return;
    for (let i = 0; i < word.length; i++) {
      if (word[i] == grid.wordToFind[i]) {
        grid.closestWord = addAtIndex(grid.closestWord, i, word[i]);
      }
    }
  }

  function addAtIndex(string: string, index: number, letter: string) {
    return (
      string.slice(0, index) + letter + string.slice(index + 1, string.length)
    );
  }

  socket.on("SUBMIT ANSWER", (id: number, answer: string) => {
    const grid = Grids.get(id);

    if (!grid) return;

    grid.answers.push(normalize(answer));

    if (answer == grid.wordToFind) {
      grid.finished = true;
    }

    updateClosestWord(grid);

    socket.emit("GRID DATA", grid.send());
  });
});
