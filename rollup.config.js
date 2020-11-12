import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
// import babel from "@rollup/plugin-babel";
import pkg from "./package.json";
import babel, { getBabelOutputPlugin } from "@rollup/plugin-babel";

export default [
  {
    input: "src/main.js",
    external: ["node-fetch", "xmldom"],
    output: [
      { name: "ia", file: pkg.browser, format: "umd" },
      { name: "ia", file: "examples/web/ia.browser.js", format: "umd" },
    ],
    plugins: [
      getBabelOutputPlugin({
        allowAllFormats: true,
        presets: ["@babel/preset-env"],
        plugins: [["@babel/plugin-transform-runtime", { useESModules: false }]],
      }),
      resolve(),
      commonjs(),
    ],
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
