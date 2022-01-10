import Grid from "../../../../packages/Classes/Grid";
import Game from "../../../../packages/Classes/Game";
import Player from "../../../../packages/Classes/Player";
import { Server, Socket } from "socket.io";

export default function (
  io: Server,
  socket: Socket,
  Games: Map<string, Game>,
  Grids: Map<string, Grid>
) {
  socket.on("JOIN GAME", function (username: string, id: string) {
    const game = Games.get(id);

    if (!game) return socket.emit("JOIN", false);

    if (game.status != "MENU") return socket.emit("JOIN", false);

    let host = false

    if (game.players.length === 0) host = true
    
    const player = new Player(username, socket.id, host);

    let res = false;

    if (!game.players.some((p) => p.username == username)) {
      game.players.push(player);
      res = true;
      socket.join(id);
    }

    socket.emit("JOIN", res, player);
    socket.emit("STATUS", game.status)
  });
}
