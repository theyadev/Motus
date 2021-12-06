import { io } from "socket.io-client";
import { reactive } from "@vue/reactivity";

const socket = reactive(io("http://localhost:8000", {}));

type startCallback = (word: string) => void;

export default function useSocket() {
  function startGame() {
    socket.emit("START GAME")
  }

  function onStart(callback: startCallback) {
    socket.on("START", (word: string) => {
      callback(word)
  })
  }

  return {
    socket, startGame, onStart
  };
}
