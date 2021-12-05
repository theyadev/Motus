import { io } from "socket.io-client";
import { reactive } from "@vue/reactivity";

const socket = reactive(io("http://localhost:8000", {}));

export default function useSocket() {
  return {
    socket,
  };
}
