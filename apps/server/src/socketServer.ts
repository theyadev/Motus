import { readdirSync } from "fs";
import { join, resolve } from "path";
import { Socket, Server } from "socket.io";

interface Modules extends Object {
  [key: string]: Function;
}

function moduleFetcher(path: string) {
  let modules: Modules = {};

  const folderPath = join("./src", path);

  const folder = readdirSync(folderPath);

  for (const file of folder) {
    if (!file.endsWith(".js") && !file.endsWith(".ts")) return;

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
  io: Server;
  constructor(server: any, path: string, ...args: any[]) {
    this.io = new Server(server, {
      cors: {
        origin: "*",
      },
    });

    this.io.on("connection",  (socket: Socket) => {
      const modules = moduleFetcher(path);

      if (!modules) return;

      for (const module in modules) {
        modules[module](this.io, socket, ...args);
      }
    });
  }
}
