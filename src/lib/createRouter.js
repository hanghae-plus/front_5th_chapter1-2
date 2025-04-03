import { createObserver } from "./createObserver";

const PROD_URL = "/front_5th_chapter1-2";

export const createRouter = (routes) => {
  const { subscribe, notify } = createObserver();

  const getPath = () => {
    const baseUrl = import.meta.env.MODE === "production" ? PROD_URL : "";
    return window.location.pathname.replace(baseUrl, "") || "/";
  };

  const getTarget = () => routes[getPath()];

  const push = (path) => {
    if (import.meta.env.MODE === "development") {
      window.history.pushState(null, null, path);
    } else {
      const baseUrl = import.meta.env.MODE === "production" ? PROD_URL : "";
      const fullPath = baseUrl + path;

      window.history.pushState(null, null, fullPath);
    }
    notify();
  };

  window.addEventListener("popstate", () => notify());

  return {
    get path() {
      return getPath();
    },
    push,
    subscribe,
    getTarget,
  };
};
