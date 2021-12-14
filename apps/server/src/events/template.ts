import Grid from "../../../../packages/Classes/Grid";
import Game from "../../../../packages/Classes/Game";

import { Server, Socket } from "socket.io";

export default function (
  io: Server,
  socket: Socket,
  Games: Map<string, Game>,
  Grids: Map<string, Grid>
) {
  socket.on("NAME", function () {

  })
}
