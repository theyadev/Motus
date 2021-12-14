import { readdirSync } from "fs";
import { join, resolve } from "path";

interface Modules extends Object {
  [key: string] : Function
}

export default function socketHandler() {
  let modules: Modules = {};

  const folderPath = join("./src/events");

  const folder = readdirSync(folderPath);

  for (const file of folder) {
    if (!file.endsWith(".js") && !file.endsWith(".ts")) return;

    const filePath = join("./events", file);

    const newModule = require("./" + filePath).default;

    modules[file.slice(0, -2)] = newModule;
  }

  return modules;
}
