import { createObserver } from "./createObserver";
import { BASE_PATH } from "../constants/basePath.js";

export const createRouter = (routes) => {
  console.log("routes", routes);
  const { subscribe, notify } = createObserver();

  const getPath = () => window.location.pathname.replace(BASE_PATH, "");

  const getTarget = () => routes[getPath()];

  const push = (path) => {
    window.history.pushState(null, null, BASE_PATH + path);
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
