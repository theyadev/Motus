import { socket } from "../index";
import usePlayer from "../../player";
import Player from "../../../../../../packages/Classes/Player";
let { updatePlayer } = usePlayer();

export default function joinGame(username: string, id: string) {
  socket.emit("JOIN GAME", username, id);

  return new Promise<boolean>(function (resolve, reject) {
    socket.once("JOIN", (join: boolean, newPlayer: Player) => {
      updatePlayer(newPlayer);
      resolve(join);
    });

    setTimeout(() => {
      reject("Pas de réponses");
    }, 10000);
  });
}
