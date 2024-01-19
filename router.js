import { useState, useEffect } from "react";
import Route from "./src/route";

export { Route };
export const Router = ({ routes }) => {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [params, setParams] = useState({});

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
      setParams(parseUrlParams(window.location.pathname));
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  const Component = routes[currentPath] || routes["/404"];
  return typeof Component === "function" ? Component(params) : Component;
};

function parseUrlParams(url) {
  const params = {};
  const urlParts = url.split("/");
  const paramKeys = Object.keys(routes).filter(
    (key) => key.includes("[") && key.includes("]")
  );

  paramKeys.forEach((key, index) => {
    const paramKey = key.replace("[", "").replace("]", "");
    params[paramKey] = urlParts[index];
  });

  return params;
}
