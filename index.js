import fs from "fs";
import path from "path";
import { useContext } from "react";
import { Router } from "./router.js";

async function readConfig() {
  const rdr_config = await import(
    path.join(process.cwd(), "/rdr.config.js")
  ).catch((e) => {
    console.log(e);
  });
  return rdr_config?.default;
}

async function Configuration() {
  const rdr_config = await readConfig();
  return {
    pages_dir: rdr_config?.pages_dir || "/src/pages",
    route_file: rdr_config?.route_file || "src/route",
    typescript: rdr_config?.typescript || false,
  };
}

export function useRouteParams() {
  const { params } = useContext(Router);
  return params;
}

export async function generateRoutes() {
  const config = await Configuration();
  const pagesDirectory = path.join(process.cwd(), config.pages_dir);
  const isTypescript = config.typescript;
  const fileExtension = isTypescript ? ".tsx" : ".js";
  const routeContentType = isTypescript ? "TypeScript" : "JavaScript";

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

    const routerCode = `import React from 'react';
 import {Router} from "react-dir-router";
 ${Object.entries(routes)
   .map(
     ([path, Component]) =>
       `import ${Component} from './pages${
         path === "/" ? "/index" : path
       }${fileExtension}';`
   )
   .join("\n")}

 const routes = {
   ${Object.entries(routes)
     .map(
       ([path, Component]) =>
         `"${
           path.toLowerCase() === "/index" ? "/" : path.toLowerCase()
         }": <${Component} />,`
     )
     .join("\n")}
 };

 const Route = () => <Router routes={routes} />;
 export default Route;
 `;

    fs.writeFile(config.route_file + fileExtension, routerCode, (err) => {
      if (err) throw err;
      console.log(
        `🚀 Routes have been successfully generated in ${routeContentType}!`
      );
    });
  });
}
