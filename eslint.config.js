import js from "@eslint/js";
import globals from "globals";
import babelParser from "@babel/eslint-parser";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

export default [
  {
    ...js.configs.recommended,
    files: ["src/**/*.js"],
    ignores: ["gulp/*.js", "src/js/entry.js", "src/js/inline/*.js", "src/js/vendor/*.js"],
    languageOptions: {
      globals: globals.browser,
      ecmaVersion: 2021,
      sourceType: "module",
      parser: babelParser,
      parserOptions: {
        requireConfigFile: false,
        babelOptions: {
          babelrc: false,
          configFile: false,
          presets: ["@babel/preset-env"],
        },
      },
    },
    plugins: {},
    rules: {
      "no-undef": "warn",
      "no-unused-vars": "warn",
      "prettier/prettier": "error",
      "react/prop-types": 0,
    },
  },
  eslintPluginPrettierRecommended,
];
