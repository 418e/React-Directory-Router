#!/usr/bin/env node
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { generateRoutes } from "./index.js";
import fs from "fs";

function init() {
  const configCode = `
    module.exports.rdr = {};
  `;
  fs.writeFile("rdr.config.js", configCode, (err) => {
    if (err) throw err;
    console.log("Configuration file has been created!");
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
    () => {},
    (argv) => {
      generateRoutes();
    }
  )
  .help().argv;
