import { io } from "socket.io-client";

import createGame from "./functions/createGame";
import doesGameExist from "./functions/doesGameExist";
import getGridData from "./functions/getGridData";
import joinGame from "./functions/joinGame";
import submitAnswer from "./functions/submitAnswer";

import getters from "./functions/getters";
import setters from "./functions/setters";
import handlers from "./functions/handlers";
import updaters from "./functions/updaters";

const isProduction = process.env.NODE_ENV === "production";

const serverUrl = isProduction ? "" : "http://localhost:8000";

export const socket = io(serverUrl, {
  transports: ["websocket"],
  upgrade: false,
  closeOnBeforeunload: false,
});

export default function useSocket() {
  return {
    createGame,
    doesGameExist,
    joinGame,
    getGridData,
    submitAnswer,
    ...getters,
    ...setters,
    ...handlers,
    ...updaters
  };
}
