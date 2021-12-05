import express from "express";
import helmet from "helmet";

import { Socket, Server } from "socket.io";
import getWords from "./functions/words";

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

const words = getWords()

io.on("connection", function (socket: Socket) {
    socket.on("START GAME", function (data) {
        console.log("START");
      
        socket.emit("START", words[Math.floor(Math.random() * (words.length-1))])
    })
})