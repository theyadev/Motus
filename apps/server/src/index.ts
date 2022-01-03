import express from "express";
import helmet from "helmet";


// Import Classes
import Game from "../../../packages/Classes/Game";
import Grid from "../../../packages/Classes/Grid";

// Import Functions
import socketServer from "./socketServer";

// Express Server
const app = express();

app.use(helmet());

const PORT = process.env.PORT || 8000;

const server = app.listen(PORT, () => {
  console.log("Server app listening on port " + PORT);
});

// Init Types
type Games = Map<string, Game>;
type Grids = Map<string, Grid>;

// Init Variables
let Games: Games = new Map();
let Grids: Grids = new Map();

const socketio = new socketServer(server, "./events", Games, Grids);
