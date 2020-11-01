import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import pkg from "./package.json";

export default [
  {
    input: "src/main.js",
    external: ["node-fetch"],
    output: [
      { name: "ia", file: pkg.browser, format: "umd" },
      { name: "ia", file: "examples/web/ia.browser.js", format: "umd" },
    ],
    plugins: [resolve(), commonjs()],
  },
  {
    input: "src/main.js",
    external: [],
    output: [
      { file: pkg.main, format: "cjs" },
      { file: pkg.module, format: "es" },
    ],
    plugins: [resolve(), commonjs()],
  },
];
