import { io } from "socket.io-client";
import { reactive } from "@vue/reactivity";
import Player from "../../../../packages/Classes/Player";
import usePlayer from "./player";

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
  finished: boolean;
  currentTurn: number;
  time: number;
}

type usersCallback = (users: Player[]) => void;

type gridCallback = (gridId: string) => void;

type gridDataCallback = (grid: GridRes) => void;

let { updatePlayer } = usePlayer()

export default function useSocket() {
  function createGame(username: string) {
    socket.emit("CREATE GAME", username);

    return new Promise<string>(function (resolve, reject) {
      socket.once("CREATE", (id: string, newPlayer: Player) => {
        updatePlayer(newPlayer)
        resolve(id);
      });

      setTimeout(() => {
        reject("Pas de réponses");
      }, 10000);
    });
  }

  function joinGame(username: string, id: string) {
    socket.emit("JOIN GAME", username, id);

    return new Promise<boolean>(function (resolve, reject) {
      socket.once("JOIN", (join: boolean, newPlayer: Player) => {
        updatePlayer(newPlayer)
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

  function updateUsers(id: string) {
    socket.emit("UPDATE PLAYERS", id);
  }

  function onUserUpdate(callback: usersCallback) {
    socket.on("PLAYERS", (newUsers) => {
      callback(newUsers);
    });
  }

  function startGame(id: string) {
    socket.emit("START GAME", id);
  }

  function onGrid(callback: gridCallback) {
    socket.on("GRID", (gridId: string) => {
      callback(gridId);
    });
  }

  function getGridData(id: string, callback: gridDataCallback) {
    socket.emit("GET GRID DATA", id);
    socket.on("GRID DATA", function (grid: GridRes) {
      callback(grid);
    });
  }

  function submitAnswer(id: string, answer: string, self: Player, callback: () => void) {
    socket.emit("SUBMIT ANSWER", id, answer, self);
    socket.on("ANSWER", () => {
      callback()
    })
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
