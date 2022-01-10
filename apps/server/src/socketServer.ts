import { readdirSync } from "fs";
import { join } from "path";
import { Socket, Server as socketioServer } from "socket.io";
import { Server as httpServer } from "http";

const DEBUG: boolean = true;

interface Modules extends Object {
  [key: string]: Function;
}

/**
 * @param path Path to the events folder.
 * @returns Object of Module
 */
function moduleFetcher(path: string) {
  let modules: Modules = {};

  const folderPath = join("./src", path);

  const folder = readdirSync(folderPath);

  for (const file of folder) {
    if (!file.endsWith(".js") && !file.endsWith(".ts")) continue;

    try {
      const filePath = join(path, file);

      const newModule = require("./" + filePath).default;

      modules[file.slice(0, -2)] = newModule;

      console.log(file + " imported !");
    } catch (error) {
      console.log("failed importing: " + file);
    }
  }

  return modules;
}

export default class socketServer {
  io: socketioServer;

  constructor(server: httpServer, path: string, ...args: any[]) {
    this.io = new socketioServer(server, {
      cors: {
        origin: "*",
      },
    });

    const modules = moduleFetcher(path);

    if (!modules)
      throw new Error("Modules import failed or there are no modules.");

    this.io.on("connection", (socket: Socket) => {
      if (DEBUG === true) {
        socket.onAny((eventName, ...args) => {
          console.log(eventName, args);
        });
      }

      for (const module in modules) {
        modules[module](this.io, socket, ...args);
      }
    });
  }
}
