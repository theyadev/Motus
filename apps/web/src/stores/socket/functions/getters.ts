/**
 * Rule for getters:
 * - 1 function with 1 emit. The emit must be handled by an handler (in handlers.ts)
 */

import { socket } from "../index";

export function getStatus(id: string) {
  socket.emit("GET STATUS", id);
}

export function getInfo(id: string) {
  socket.emit("GET INFO", id);
}

export default {
    getStatus, getInfo
}
