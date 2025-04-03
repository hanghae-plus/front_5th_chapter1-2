import { createObserver } from "./createObserver";
import { BASE_PATH } from "../constants/constants";

export const createRouter = (routes) => {
  const { subscribe, notify } = createObserver();

  const getPath = () => {
    const path = window.location.pathname;

    return path.replace(BASE_PATH, "") || "/";
  };

  const getTarget = () => routes[getPath()];

  const push = (path) => {
    const fullPath = BASE_PATH + path;
    window.history.pushState(null, null, fullPath);
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
