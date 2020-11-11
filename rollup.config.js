import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import babel from "@rollup/plugin-babel";
import pkg from "./package.json";

export default [
  {
    input: "src/main.js",
    external: ["node-fetch", "xmldom"],
    output: [
      { name: "ia", file: pkg.browser, format: "umd" },
      { name: "ia", file: "examples/web/ia.browser.js", format: "umd" },
    ],
    plugins: [
      // babel({ babelrc: true }),
      babel({
        babelrc: false,
        // targets: {
        //   node: "10",
        // },
        // babelHelpers: "runtime",
        // plugins: [
        //   // "@babel/plugin-external-helpers",
        //   // "transform-async-to-generator",
        //   // "syntax-async-functions",
        //   [
        //     "@babel/plugin-transform-runtime",
        //     {
        //       regenerator: true,
        //       absoluteRuntime: false,
        //       corejs: false,
        //       helpers: true,
        //       regenerator: true,
        //       // useESModules: false,
        //       // version: "7.0.0-beta.0",
        //     },
        //   ],
        // ],
        presets: [
          "@babel/preset-env",
          // {
          //   // modules: false,
          //   targets: {
          //     browsers: [">0.25%", "not op_mini all"],
          //   },
          // },
        ],
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
