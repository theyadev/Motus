import { io } from "socket.io-client";

import createGame from "./functions/createGame";
import doesGameExist from "./functions/doesGameExist";
import getGridData from "./functions/getGridData";
import joinGame from "./functions/joinGame";
import onGrid from "./functions/onGrid";
import onUserUpdate from "./functions/onUserUpdate";
import startGame from "./functions/startGame";
import submitAnswer from "./functions/submitAnswer";
import updateUsers from "./functions/updateUser";

const isProduction = process.env.NODE_ENV === "production";

const serverUrl = isProduction ? "" : "http://localhost:8000";

export const socket = io(serverUrl, {
  transports: ["websocket"],
  upgrade: false,
  closeOnBeforeunload: false,
});

export default function useSocket() {
  return {
    startGame,
    createGame,
    onUserUpdate,
    doesGameExist,
    joinGame,
    updateUsers,
    onGrid,
    getGridData,
    submitAnswer,
  };
}