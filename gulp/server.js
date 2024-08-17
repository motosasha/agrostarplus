"use strict";

import gulp, { parallel } from "gulp";
import browserSync from "browser-sync";
import path from "path";
import fs from "fs";
import chalk from "chalk";

import { config } from "./config.js";
import { calcGraph } from "./calcGraph.js";
import { pagesCollector } from "./utils/pagesCollector.js";
import { writePugMixinsFile } from "./writePugMixinsFile.js";
import { writeSassImportsFile } from "./writeSassImportsFile.js";
import { writeJsRequiresFile } from "./writeJsRequiresFile.js";
import { compilePug, compilePugFast } from "./compilePug.js";
import { compileSass } from "./compileSass.js";
import { compileJs } from "./compileJs.js";
import { compileJson } from "./compileJson.js";
import { copySources, copyBlockImg } from "./copySources.js";
import { generateSvgSprite } from "./generateSvgSprite.js";
import { graphLog } from "./utils/graphLog.js";

const { watch, series } = gulp;

export function server() {
  browserSync.init(config.serverOptions);

  // Pages: add, change
  watch(
    [`${config.from.pages}/**/*.pug`, `${config.from.library}/library.pug`],
    { events: ["add", "change"], delay: 100 },
    series(
      parallel(calcGraph),
      parallel(writePugMixinsFile, writeSassImportsFile),
      parallel(compilePugFast, compileSass),
      graphLog,
      reload,
    ),
  );

  // Pages: unlink
  watch([`${config.from.pages}/**/*.pug`], { delay: 100 }).on("unlink", function (filepath) {
    let filePathInBuildDir = filepath.replace(`${config.from.root}/pages/`, config.to.pages).replace(".pug", ".html");
    fs.unlink(filePathInBuildDir, (err) => {
      if (err) throw err;
      console.log("[", chalk.yellow("action"), `] Page deleted: ${filePathInBuildDir}`);
    });
    calcGraph();
    graphLog();
  });

  // Blocks
  const blocksWatcher = watch([`${config.from.blocks}/**/*.pug`, `${config.from.library}/blocks/**/*.pug`], {
    delay: 100,
  });

  // Blocks markup: add
  blocksWatcher.on("add", function (filepath) {
    const rebuiltPages = pagesCollector(filepath);
    console.log("[", chalk.yellow("action"), `] Block created: ${path.basename(filepath, ".pug")}`);
    calcGraph();
    if (rebuiltPages.length) {
      writePugMixinsFile();
      compilePug(rebuiltPages);
      writeSassImportsFile();
      compileSass();
      browserSync.reload();
    }
    graphLog();
    setTimeout(() => console.log(`========== ==================================================`), 250);
  });

  // Blocks markup: change
  blocksWatcher.on("change", function (filepath) {
    const rebuildPages = pagesCollector(filepath);
    calcGraph();
    if (rebuildPages.length) {
      writePugMixinsFile();
      compilePug(rebuildPages);
      browserSync.reload();
    }
    console.log("[", chalk.yellow("action"), `] Block changed: ${path.basename(filepath, ".pug")}`);
    graphLog();
    setTimeout(() => {
      console.log(`========== ==================================================`);
    }, 250);
  });

  // Blocks style
  const blocksStyleWatcher = watch([`${config.from.blocks}/**/*.scss`, `${config.from.library}/blocks/**/*.scss`], {
    delay: 100,
  });

  // Blocks style: add
  blocksStyleWatcher.on("add", function (filepath) {
    const rebuiltPages = pagesCollector(filepath);
    console.log("[", chalk.yellow("action"), `] Block created: ${path.basename(filepath, ".scss")}`);
    calcGraph();
    if (rebuiltPages.length) {
      writeSassImportsFile();
      compileSass();
      browserSync.reload();
    }
    graphLog();
    setTimeout(() => console.log(`========== ==================================================`), 250);
  });

  // Blocks style: change
  watch(
    [`${config.from.blocks}/**/*.scss`, `${config.from.library}/blocks/**/*.scss`, `!${config.from.style}/style.scss`],
    { events: ["change"], delay: 100 },
    series(writeSassImportsFile, compileSass),
  );

  // Blocks: unlink
  watch(
    [
      `${config.from.blocks}/**/*.pug`,
      `${config.from.blocks}/**/*.scss`,
      `${config.from.library}/blocks/**/*.pug`,
      `${config.from.library}/blocks/**/*.scss`,
    ],
    {
      delay: 100,
    },
  ).on("unlink", function (filepath) {
    calcGraph();
    writePugMixinsFile();
    writeSassImportsFile();
    compilePug({});
    compileSass();
    console.log("[", chalk.yellow("action"), `] Block deleted: ${filepath}`);
    graphLog();
    browserSync.reload();
    console.log(`========== ==================================================`);
  });

  // Service blocks markup: change
  watch([`${config.from.service}/**/*.pug`], { events: ["change"], delay: 100 }, series(compilePug, reload));

  // Templates
  const templatesWatcher = watch(
    [
      `${config.from.templates}/**/*.pug`,
      `${config.from.library}/templates/**/*.pug`,
      `!${config.from.templates}/mixins.pug`,
    ],
    { delay: 100 },
  );

  // Templates: change
  templatesWatcher.on("change", function (filepath) {
    const rebuildPages = pagesCollector(filepath);
    if (rebuildPages.length) {
      console.log("[", chalk.yellow("action"), `] Template changed: ${path.basename(filepath, ".pug")}`);
      calcGraph();
      writePugMixinsFile();
      compilePug(rebuildPages);
      browserSync.reload();
      graphLog();
    }
  });

  // Global styles: all
  watch(
    [`${config.from.style}/**/*.scss`, `${config.from.library}/scss/**/*.scss`, `!${config.from.style}/style.scss`],
    { events: ["all"], delay: 100 },
    series(compileSass),
  );

  // Global scripts: all
  watch(
    [
      `${config.from.js}/**/*.js`,
      `!${config.from.js}/entry.js`,
      `!${config.from.js}/inline/*.js`,
      `${config.from.blocks}/**/*.js`,
    ],
    {
      events: ["all"],
      delay: 100,
    },
    series(writeJsRequiresFile, compileJs, reload),
  );

  // Included scripts: all
  watch(
    [`${config.from.js}/inline/*.js`],
    {
      events: ["all"],
      delay: 100,
    },
    series(calcGraph, compilePug, reload),
  );

  // Copy sources: all
  watch(
    [
      `${config.from.img}/**/*.{${config.fileFormats}}`,
      `${config.from.img}/favicon/**/*.*`,
      `${config.from.fonts}/**/*.*`,
      `${config.from.assets}/**/*.*`,
    ],
    { events: ["all"], delay: 100 },
    series(copySources, reload),
  );

  // Copy images: all
  watch(
    [`${config.from.blocks}/**/img/**/*.{${config.fileFormats}}`],
    { events: ["all"], delay: 100 },
    series(copyBlockImg, reload),
  );

  // SVG sprites: all
  watch(
    [`${config.from.symbols}/*.svg`, `${config.from.symbols}/svgAsBg.xml`, `${config.from.blocks}/**/symbols/**/*.svg`],
    { events: ["all"], delay: 100 },
    series(generateSvgSprite, reload),
  );

  // JSON: all
  watch([`${config.from.data}/**/*.json`], { events: ["all"], delay: 100 }, series(compileJson, compilePug, reload));

  console.log(`========== ==================================================`);
}

function reload(done) {
  browserSync.reload();
  console.log(`========== ==================================================`);
  done?.();
}
