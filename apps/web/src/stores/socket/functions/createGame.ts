import { socket } from "../index";
import usePlayer from "../../player";
import Player from "../../../../../../packages/Classes/Player";
let { updatePlayer } = usePlayer();

export default function createGame(username: string) {
  socket.emit("CREATE GAME", username);

  return new Promise<string>(function (resolve, reject) {
    socket.once("CREATE", (id: string, newPlayer: Player) => {
      updatePlayer(newPlayer);
      resolve(id);
    });

    setTimeout(() => {
      reject("Pas de réponses");
    }, 10000);
  });
}
