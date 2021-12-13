import { io } from "socket.io-client";
import { reactive } from "@vue/reactivity";
import Player from "../../../types/Player";

const isProduction = process.env.NODE_ENV === "production";

const serverUrl = isProduction ? "" : "http://localhost:8000";

const socket = reactive(
  io(serverUrl, {
    transports: ["websocket"],
    upgrade: false,
    closeOnBeforeunload: false,
  })
);

interface GridRes {
  answers: string[];
  closestWord: string;
  wordToFind: string;
  finished: boolean
}

type usersCallback = (users: Player[]) => void;

type gridCallback = (gridId: number) => void;

type gridDataCallback = (grid: GridRes) => void;

export default function useSocket() {
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
    socket.emit("UPDATE PLAYERS", id);
  }

  function onUserUpdate(callback: usersCallback) {
    socket.on("PLAYERS", (newUsers) => {
      callback(newUsers);
    });
  }

  function startGame(id: number) {
    socket.emit("START GAME", id);
  }

  function onGrid(callback: gridCallback) {
    socket.on("GRID", (gridId: number) => {
      callback(gridId);
    });
  }

  function getGridData(id: number, callback: gridDataCallback) {
    socket.emit("GET GRID DATA", id);
    socket.on("GRID DATA", function (grid: GridRes) {
      callback(grid);
    });
  }

  function submitAnswer(id: number, answer: string) {
    socket.emit("SUBMIT ANSWER", id, answer)
  }

  return {
    startGame,
    createGame,
    onUserUpdate,
    doesGameExist,
    joinGame,
    updateUsers,
    onGrid,
    getGridData,
    submitAnswer
  };
}
