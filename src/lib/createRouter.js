import { createObserver } from "./createObserver";

const BASE_PATH =
  process.env.NODE_ENV === "production" ? "/front_5th_chapter1-2" : "";

export const createRouter = (routes) => {
  const { subscribe, notify } = createObserver();

  const getPath = () => {
    const fullPath = window.location.pathname;

    return BASE_PATH && fullPath.startsWith(BASE_PATH)
      ? fullPath.slice(BASE_PATH.length)
      : fullPath;
  };

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
