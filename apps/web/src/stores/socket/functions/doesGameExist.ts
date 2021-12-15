import { socket } from "../index";

export default function doesGameExist(id: unknown) {
  socket.emit("DOES GAME EXIST", id);
  return new Promise<boolean>(function (resolve, reject) {
    socket.once("EXIST", (exist: boolean) => {
      resolve(exist);
    });

    setTimeout(() => {
      reject("Pas de réponses");
    }, 10000);
  });
}
