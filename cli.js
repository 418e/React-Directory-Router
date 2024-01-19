#!/usr/bin/env node
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { generateRoutes } from "./index.js";
import fs from "fs";
import chokidar from "chokidar";

function init() {
  const configCode = `const rdr = {
   pages_dir: "", // /src/pages
   route_file: "", // src/route.js
 };
 export default rdr;`;
  fs.writeFile("rdr.config.js", configCode, (err) => {
    if (err) throw err;
    console.log("🎉 Configuration file successfully created!");
  });
}

yargs(hideBin(process.argv))
  .command(
    "init",
    "Initialize the project",
    () => {},
    (argv) => {
      init();
    }
  )
  .command(
    "route",
    "Generate routes",
    (yargs) => {
      yargs.option("watch", {
        alias: "w",
        describe: "Watch files for changes and regenerate routes",
        type: "boolean",
      });
    },
    (argv) => {
      if (argv.watch) {
        chokidar.watch(".").on("change", () => {
          generateRoutes();
        });
      } else {
        generateRoutes();
      }
    }
  )
  .help().argv;
