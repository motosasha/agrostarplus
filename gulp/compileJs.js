"use strict";

import path from "path";
import resolve from "@rollup/plugin-node-resolve";
import rollupReplace from "@rollup/plugin-replace";
import babel from "@rollup/plugin-babel";
import multi from "@rollup/plugin-multi-entry";
import terser from "@rollup/plugin-terser";
import commonjs from "@rollup/plugin-commonjs";

import { rollup } from "rollup";
import { config } from "./config.js";

export function compileJs(cb) {
  const babelConfig = {
    babelHelpers: "runtime",
    presets: ["@babel/preset-env"],
    plugins: ["@babel/plugin-transform-runtime"],
    exclude: ["**/node_modules/**"],
  };

  for (const script of config.jsScripts) {
    let fileName = path.basename(script, ".js");
    if (fileName === "entry") fileName = "bundle";
    rollup({
      input: script,
      plugins: [
        multi(),
        resolve(),
        rollupReplace({
          preventAssignment: true,
          values: {
            "process.env.NODE_ENV": JSON.stringify(config.mode),
          },
        }),
        config.mode !== "development" && terser(),
        babel(babelConfig),
        commonjs(),
      ],
    }).then((bundle) => {
      return bundle.write({
        file: `${config.to.js}/${fileName}.js`,
        format: "esm",
        name: fileName,
        sourcemap: config.mode === "development",
      });
    });
  }

  cb?.();
}
