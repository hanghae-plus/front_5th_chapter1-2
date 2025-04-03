import { BASE_PATH } from "../utils/basePath";
import { createObserver } from "./createObserver";

export const createRouter = (routes) => {
  const { subscribe, notify } = createObserver();

  const getPath = () => window.location.pathname.replace(BASE_PATH, "");

  const getTarget = () => routes[getPath()];

  const push = (path) => {
    window.history.pushState(null, null, `${BASE_PATH}${path}`);
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
