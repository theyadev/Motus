import express from "express";
import helmet from "helmet";

import { Socket, Server } from "socket.io";
import getWords from "./functions/words";

import Player from "../../types/Player"

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

type Mode = "FFA" | "TEAM" | "BR";

class Game {
  id: number;
  users: Player[];
  mode: Mode;

  constructor(id: number, host: Player) {
    this.id = id;
    this.users = [host];
    this.mode = "FFA";
  }
}

let Games: Map<number, Game> = new Map();

function generateSeed() {
  let id = Math.floor(Math.random() * 1000000000);
  while (Games.has(id)) {
    id = Math.floor(Math.random() * 1000000000);
  }

  return id;
}

io.on("connection", function (socket: Socket) {
  socket.on("START GAME", function () {
    console.log("START");

    socket.emit("START", words[Math.floor(Math.random() * (words.length - 1))]);
  });

  socket.on("CREATE GAME", function (username: string) {
    const id = generateSeed();

    const player = new Player(username, true);
    const game = new Game(id, player);

    Games.set(id, game);

    socket.emit("CREATE", id);

    socket.join(id.toString())
  });

  socket.on("JOIN GAME", function (username: string, id: number) {
    const player = new Player(username);

    const game = Games.get(id);

    if (!game) {
      return socket.emit("JOIN", false);
    }

    if (!game.users.some((p) => p.username == username)) {
      game.users.push(player);
      socket.emit("JOIN", true);

      socket.join(id.toString())
    } else {
      socket.emit("JOIN", false);
    }

  });

  socket.on("UPDATE USERS", (id: number) => {
    const game = Games.get(id);

    if (!game) return

    io.sockets.in(game.id.toString()).emit("USERS", game.users)
  })

  socket.on("DOES GAME EXIST", function (id: number) {
    socket.emit("EXIST", Games.has(id));
  });
});
