import { BASE_URL } from "../utils/baseUrl";
import { createObserver } from "./createObserver";

export const createRouter = (routes) => {
  const { subscribe, notify } = createObserver();

  const getPath = () => {
    return window.location.pathname.replace(BASE_URL, "") || "";
  };

  const getTarget = () => routes[getPath()];

  const push = (path) => {
    window.history.pushState(null, null, BASE_URL + path);
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
