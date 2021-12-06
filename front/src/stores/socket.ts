import { io } from "socket.io-client";
import { reactive } from "@vue/reactivity";

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

export default function useSocket() {
  function startGame(callback: startCallback) {
    socket.emit("START GAME");
    socket.once("START", (word: string) => {
      callback(word);
    });
  }

  return {
    socket,
    startGame,
  };
}
