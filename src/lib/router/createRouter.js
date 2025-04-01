import { createObserver } from "../observer";

const BASE_PATH =
  process.env.NODE_ENV === "production" ? "/front_5th_chapter1-2" : "";

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
