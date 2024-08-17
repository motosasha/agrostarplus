"use strict";

import { deleteAsync } from "del";
import { config } from "./config.js";

export function clearBuildDir() {
  return deleteAsync([`${config.to.root}/**/*`, `!${config.to.root}/readme.md`]);
}
