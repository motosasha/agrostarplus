import path from "path";
import ghPages from "gh-pages";
import chalk from "chalk";

import { config } from "./config.js";

const timeOut = 5000;

export function deploy(cb) {
  console.log("[ ", chalk.yellow("wait"), ` ] Waiting build folder before deploying (${timeOut})`);
  setTimeout(() => {
    console.log("[", chalk.yellow("deploy"), `] Deploying gh-pages`);
    ghPages.publish(path.join(process.cwd(), config.to.root), {}, cb).then();
  }, timeOut);
}
