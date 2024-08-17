"use strict";

import { src, dest, lastRun } from "gulp";
import fs from "fs";
import pug from "gulp-pug";
import debug from "gulp-debug";
import newer from "gulp-newer";
import notify from "gulp-notify";
import plumber from "gulp-plumber";
import prettyHtml from "gulp-pretty-html";
import pugLinter from "gulp-pug-linter";
import pugLintStylish from "puglint-stylish";

import { config } from "./config.js";
const {
  isProjectLibrary,
  isProjectNav,
  paths: { pug: pugPaths },
  deployUrl,
} = config;

export function compilePug({ pagesList = [`${config.from.pages}/**/*.pug`] }) {
  if (config.isProjectLibrary) pagesList.push(`${config.from.library}/library.pug`);
  return src(pagesList)
    .pipe(
      plumber({
        errorHandler: notify.onError(function (err) {
          return {
            title: "Сборка разметки",
            message: err.message,
          };
        }),
      }),
    )
    .pipe(pugLinter({ reporter: pugLintStylish, silenceOnSuccess: true }))
    .pipe(
      pug({
        data: { isProjectLibrary, isProjectNav, deployUrl, pugPaths },
        locals: JSON.parse(fs.readFileSync(`${config.from.json}/data.json`, "utf8")),
      }),
    )
    .pipe(prettyHtml(config.prettyOption))
    .pipe(debug({ title: "Compiled page(s)" }))
    .pipe(plumber.stop())
    .pipe(dest(config.to.pages));
}

export function compilePugFast({ pagesList = [`${config.from.pages}/**/*.pug`] }) {
  if (config.isProjectLibrary) pagesList.push(`${config.from.library}/library.pug`);
  return src(pagesList, { since: lastRun(compilePugFast) })
    .pipe(newer(config.to.pages))
    .pipe(
      plumber({
        errorHandler: notify.onError(function (err) {
          return {
            title: "Markup building",
            message: err.message,
          };
        }),
      }),
    )
    .pipe(pugLinter({ reporter: pugLintStylish, silenceOnSuccess: true }))
    .pipe(
      pug({
        data: { isProjectLibrary, isProjectNav, deployUrl, pugPaths },
        locals: JSON.parse(fs.readFileSync(`${config.from.json}/data.json`, "utf8")),
      }),
    )
    .pipe(prettyHtml(config.prettyOption))
    .pipe(debug({ title: "Compiled page(s)" }))
    .pipe(plumber.stop())
    .pipe(dest(config.to.pages));
}
