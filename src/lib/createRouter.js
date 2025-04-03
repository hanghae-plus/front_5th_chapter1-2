import { BASE_PATH, isHashMode } from "../utils/basePath";
import { createObserver } from "./createObserver";

export const createRouter = (routes) => {
  const { subscribe, notify } = createObserver();

  const getPath = () => {
    if (isHashMode) {
      const hash = location.hash.slice(1) || "/";
      return hash;
    }
    const path = window.location.pathname;
    return path.replace(BASE_PATH, "") || "/";
  };

  const getTarget = () => routes[getPath()];

  const push = (path) => {
    if (isHashMode) {
      location.hash = path;
    } else {
      window.history.pushState(null, null, BASE_PATH + path);
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
