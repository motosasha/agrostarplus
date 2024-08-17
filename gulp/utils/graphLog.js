import chalk from "chalk";

import { config } from "../config.js";

export function graphLog(cb) {
  setTimeout(() => {
    if (config.logging) console.log("[", chalk.bgYellow("•graph"), "]", config.graph);
  }, 200);
  cb?.();
}
