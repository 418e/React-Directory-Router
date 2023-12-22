import fs from "fs";
import path from "path";

const pagesDirectory = path.join(process.cwd(), "/src/pages");
const files = fs.readdirSync(pagesDirectory);

const pages = files.map((file) => {
  const route =
    "/" +
    file
      .replace(".js", "")
      .replace(".jsx", "")
      .replace(".ts", "")
      .replace(".tsx", "");

  const fileContent = fs.readFileSync(path.join(pagesDirectory, file), "utf-8");
  const match = fileContent.match(/function\s+([^\s(]+)/);
  const componentName = match ? match[1] : null;

  return { route, componentName };
});

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
    console.log("The file has been saved!");
  });
});
