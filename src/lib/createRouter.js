import { createObserver } from "./createObserver";

export const createRouter = (routes) => {
  const base =
    process.env.NODE_ENV === "production" ? "/front_5th_chapter1-2" : "";
  const { subscribe, notify } = createObserver();

  const getPath = () => window.location.pathname;

  const getTarget = () => routes[getPath()];

  const push = (path) => {
    window.history.pushState(null, null, base + path);
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
