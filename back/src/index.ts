import express from "express";
import helmet from "helmet";

import { Socket, Server } from "socket.io";
import getWords from "./functions/words";

import Player from "../../types/Player";
import normalize from "../../functions/normalize";

const app = express();

app.use(helmet());

const PORT = process.env.PORT || 8000;

const server = app.listen(PORT, () => {
  console.log("Server app listening on port " + PORT);
});

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const words = getWords();

/**
 * FFA : One grid for all players
 * FFFA : Fast Free For All. One grid per player with the same word
 */
type Mode = "FFA" | "FFA TEAM" | "BR" | "FFFA";

type State = "IN GAME" | "MENU";

type Games = Map<number, Game>;

type Grids = Map<number, Grid>;

class Game {
  id: number;
  players: Player[];
  mode: Mode;
  state: State;
  currentRound: number;
  maxRound: number;
  playTime: number;

  constructor(id: number, host: Player) {
    this.id = id;
    this.players = [host];
    this.mode = "FFA";
    this.state = "MENU";
    this.currentRound = 0;
    this.maxRound = 5;
    this.playTime = 60;
  }
}

class Grid {
  id: number;
  answers: string[];
  wordToFind: string;
  closestWord: string;
  playerIndex: number;
  finished: boolean;

  constructor(id: number, wordToFind: string) {
    this.id = id;
    this.answers = [];
    this.wordToFind = wordToFind;
    this.closestWord = ".".repeat(wordToFind.length);
    this.playerIndex = 0;
    this.finished = false;
  }

  // TODO: Trouver un meilleur nom !!!!!!!!!!
  send() {
    return {
      answers: this.answers,
      closestWord: this.closestWord,
      wordToFind: this.wordToFind,
      finished: this.finished,
    };
  }
}

let Games: Games = new Map();

let Grids: Grids = new Map();

function generateSeed(duplicates: Games | Grids) {
  let id = Math.floor(Math.random() * 1000000000);
  while (duplicates.has(id)) {
    id = Math.floor(Math.random() * 1000000000);
  }

  return id;
}

function getRandomWord() {
  return words[Math.floor(Math.random() * (words.length - 1))];
}

io.on("connection", function (socket: Socket) {
  socket.on("START GAME", function (id: number) {
    const game = Games.get(id);

    if (!game) return;

    let word;

    switch (game.mode) {
      case "FFFA":
        word = getRandomWord();

        for (const player of game.players) {
          const id = generateSeed(Grids);
          Grids.set(id, new Grid(id, word));

          player.gridId = id;
        }

        break;
      case "FFA":
        word = getRandomWord();

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
