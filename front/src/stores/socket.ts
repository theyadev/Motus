import { io } from "socket.io-client";
import { reactive } from "@vue/reactivity";
import Player from "../../../types/Player"

const isProduction = process.env.NODE_ENV === "production";

const serverUrl = isProduction ? "" : "http://localhost:8000";

const socket = reactive(
  io(serverUrl, {
    transports: ["websocket"],
    upgrade: false,
    closeOnBeforeunload: false,
  })
);

type startCallback = (word: string) => void;

type usersCallback = (users: Player[]) => void;

export default function useSocket() {
  function startGame(callback: startCallback) {
    socket.emit("START GAME");
    socket.once("START", (word: string) => {
      callback(word);
    });
  }

  function createGame(username: string) {
    socket.emit("CREATE GAME", username);

    return new Promise<number>(function (resolve, reject) {
      socket.once("CREATE", (id: number) => {
        console.log(id);

        resolve(id);
      });

      setTimeout(() => {
        reject("Pas de réponses");
      }, 10000);
    });
  }

  function joinGame(username: string, id: number) {
    socket.emit("JOIN GAME", username, id);

    return new Promise<boolean>(function (resolve, reject) {
      socket.once("JOIN", (join: boolean) => {
        resolve(join);
      });

      setTimeout(() => {
        reject("Pas de réponses");
      }, 10000);
    });
  }

  function doesGameExist(id: unknown) {
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

  function updateUsers(id: number) {
    socket.emit("UPDATE USERS", id);
  }

  function onUserUpdate(callback: usersCallback) {
    socket.on("USERS", (newUsers) => {
      callback(newUsers);
    });
  }

  return {
    startGame,
    createGame,
    onUserUpdate,
    doesGameExist,
    joinGame,
    updateUsers,
  };
}
