import { createObserver } from "./createObserver";

const isProduction = import.meta.env.MODE === "production";
const BASE = isProduction ? "/front_5th_chapter1-2" : "";

export const createRouter = (routes) => {
  const { subscribe, notify } = createObserver();

  const getPath = () => window.location.pathname.replace(BASE, "") || "/";

  const getTarget = () => routes[getPath()];

  const push = (path) => {
    if (isProduction) {
      window.history.pushState(null, null, path);
    } else {
      window.history.pushState(null, null, BASE + path);
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
