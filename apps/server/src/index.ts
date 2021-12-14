import express from "express";
import helmet from "helmet";

import { Socket, Server } from "socket.io";

// Import Classes
import Game from "../../../packages/Classes/Game";
import Grid from "../../../packages/Classes/Grid";

// Import Functions
import socketHandler from "./socketHandler";

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
type Games = Map<string, Game>;
type Grids = Map<string, Grid>;

// Init Variables
let Games: Games = new Map();
let Grids: Grids = new Map();

io.on("connection", function (socket: Socket) {
  const modules = socketHandler();

  if (modules) {
    for (const module in modules) {      
      modules[module](io, socket, Games, Grids);
    }
  }
});
