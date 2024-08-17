"use strict";

import { series, parallel, task } from "gulp";
import { writePugMixinsFile } from "./gulp/writePugMixinsFile.js";
import { writeSassImportsFile } from "./gulp/writeSassImportsFile.js";
import { writeJsRequiresFile } from "./gulp/writeJsRequiresFile.js";
import { compilePug, compilePugFast } from "./gulp/compilePug.js";
import { compileSass } from "./gulp/compileSass.js";
import { compileJs } from "./gulp/compileJs.js";
import { compileJson } from "./gulp/compileJson.js";
import { generateSvgSprite } from "./gulp/generateSvgSprite.js";
import { copySources, copyBlockImg } from "./gulp/copySources.js";
import { clearBuildDir } from "./gulp/clearBuildDir.js";
import { calcGraph } from "./gulp/calcGraph.js";
import { deploy } from "./gulp/ghPages.js";
import { server } from "./gulp/server.js";
import { graphLog } from "./gulp/utils/graphLog.js";

task("compile:pugMixin", writePugMixinsFile);
task("compile:sassMixin", writeSassImportsFile);
task("compile:jsRequires", writeJsRequiresFile);
task("compile:pug", compilePug);
task("compile:pugFast", compilePugFast);
task("compile:sass", compileSass);
task("compile:js", compileJs);
task("compile:json", compileJson);
task("compile:svgSprite", generateSvgSprite);
task("copy:sources", copySources);
task("copy:blockImg", copyBlockImg);
task("dev:clear", clearBuildDir);
task("dev:deploy", deploy);
task("dev:graph", calcGraph);
task("dev:server", server);
task("dev:log", graphLog);

task(
  "default",
  series(
    parallel("dev:clear", "dev:graph"),
    parallel("compile:pugMixin", "compile:sassMixin", "compile:jsRequires", "compile:json"),
    parallel("compile:pugFast", "compile:sass", "compile:js"),
    parallel("copy:sources", "copy:blockImg", "compile:svgSprite"),
    "dev:log",
    "dev:server",
  ),
);

task(
  "build",
  series(
    parallel("dev:clear", "dev:graph"),
    parallel("compile:pugMixin", "compile:sassMixin", "compile:jsRequires", "compile:json"),
    parallel("compile:pugFast", "compile:sass", "compile:js"),
    parallel("copy:sources", "copy:blockImg", "compile:svgSprite"),
    "dev:log",
  ),
);

task(
  "deploy",
  series(
    parallel("dev:clear", "dev:graph"),
    parallel("compile:pugMixin", "compile:sassMixin", "compile:jsRequires", "compile:json"),
    parallel("compile:pugFast", "compile:sass", "compile:js"),
    parallel("copy:sources", "copy:blockImg", "compile:svgSprite"),
    "dev:log",
    "dev:deploy",
  ),
);
