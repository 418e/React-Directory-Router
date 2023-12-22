import { useState, useEffect } from "react";

export const Router = ({ routes }) => {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [params, setParams] = useState({});

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
      setParams(window.location.search);
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  const Component = routes[currentPath] || routes["/404"];
  return typeof Component === "function" ? Component(params) : Component;
};
