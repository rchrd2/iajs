import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import babel, { getBabelOutputPlugin } from "@rollup/plugin-babel";
import pkg from "./package.json";

function browser(name) {
  return {
    input: "src/main.js",
    external: ["node-fetch", "xmldom"],
    output: [
      {
        name: "ia",
        file: name,
        format: "umd",
        plugins: [
          getBabelOutputPlugin({
            presets: [["@babel/env", { modules: "umd" }]],
            allowAllFormats: true,
          }),
        ],
      },
    ],
    plugins: [
      resolve(),
      commonjs(),
      babel({
        babelHelpers: "bundled",
        plugins: ["babel-plugin-async-to-promises"],
      }),
    ],
  };
}

function modern(name) {
  return {
    input: "src/main.js",
    external: ["node-fetch", "xmldom"],
    output: [
      {
        name: "ia",
        file: name,
        format: "umd",
        plugins: [
          getBabelOutputPlugin({
            presets: [
              [
                "@babel/env",
                {
                  modules: "umd",
                  targets: [
                    "last 2 Chrome versions",
                    "last 2 iOS major versions",
                  ],
                },
              ],
            ],
            allowAllFormats: true,
          }),
        ],
      },
    ],
    plugins: [resolve(), commonjs()],
  };
}

export default [
  browser(pkg.browser),
  browser("examples/web/ia.browser.js"),
  modern("dist/ia.modern.js"),
  {
    input: "src/main.js",
    external: [],
    output: [
      { file: pkg.main, format: "cjs" },
      { file: pkg.module, format: "es" },
    ],
    plugins: [commonjs()],
  },
];
