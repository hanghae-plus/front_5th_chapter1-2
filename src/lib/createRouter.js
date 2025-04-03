import { createObserver } from "./createObserver";
import { BASE_PATH } from "../constants/index.js";
export const createRouter = (routes) => {
  const { subscribe, notify } = createObserver();

  const getPath = () => {
    const { pathname } = window.location;
    return pathname.startsWith(BASE_PATH)
      ? pathname.slice(BASE_PATH.length)
      : pathname;
  };

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
