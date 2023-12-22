import fs from "fs";
import path from "path";

export function generateRoutes() {
  const pagesDirectory = path.join(process.cwd(), "/src/pages");

  function getFiles(dirPath) {
    let files;
    try {
      files = fs.readdirSync(dirPath);
    } catch (err) {
      console.error(`Failed to read directory at ${dirPath}: ${err}`);
      return [];
    }

    let filePaths = [];
    files.forEach((file) => {
      let fullPath = path.join(dirPath, file);
      let isDirectory;
      try {
        isDirectory = fs.statSync(fullPath).isDirectory();
      } catch (err) {
        console.error(
          `Failed to check if path is a directory at ${fullPath}: ${err}`
        );
        return;
      }
      if (isDirectory) {
        filePaths = [...filePaths, ...getFiles(fullPath)];
      } else {
        filePaths.push(fullPath);
      }
    });
    return filePaths;
  }

  const files = getFiles(pagesDirectory);

  const pages = files
    .map((file) => {
      let fileContent;
      try {
        fileContent = fs.readFileSync(file, "utf-8");
      } catch (err) {
        console.error(`Failed to read file at ${file}: ${err}`);
        return null;
      }

      const relativePath = path.relative(pagesDirectory, file);
      const route =
        "/" +
        relativePath
          .replace(".js", "")
          .replace(".jsx", "")
          .replace(".ts", "")
          .replace(".tsx", "");

      const match = fileContent.match(/function\s+([^\s(]+)/);
      const componentName = match ? match[1] : null;

      return { route, componentName };
    })
    .filter(Boolean);

  Promise.all(pages).then((pages) => {
    const routes = pages.reduce((acc, page) => {
      acc[page.route] = page.componentName;
      return acc;
    }, {});

    const routerCode = `
    import React from 'react';
    import {Router} from "react-dir-router/router";
    ${Object.entries(routes)
      .map(
        ([path, Component]) => `
      import ${Component} from './pages${path === "/" ? "/index" : path}';
    `
      )
      .join("\n")}

    const routes = {
      ${Object.entries(routes)
        .map(
          ([path, Component]) => `
        "${
          path.toLowerCase() === "/index" ? "/" : path.toLowerCase()
        }": <${Component} />,
      `
        )
        .join("\n")}
    };

    const Route = () => <Router routes={routes} />;

    export default Route;
  `;

    fs.writeFile("src/route.js", routerCode, (err) => {
      if (err) throw err;
      console.log("Routes have been generated!");
    });
  });
}
