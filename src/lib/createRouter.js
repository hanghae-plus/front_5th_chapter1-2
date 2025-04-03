import { createObserver } from "./createObserver";
import { BASE_ROUTE } from "../constants/basePath";

export const createRouter = (routes) => {
  const { subscribe, notify } = createObserver();

  const getPath = () => window.location.pathname.replace(BASE_ROUTE, "");

  const getTarget = () => routes[getPath()];

  const push = (path) => {
    window.history.pushState(null, null, BASE_ROUTE + path);
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
