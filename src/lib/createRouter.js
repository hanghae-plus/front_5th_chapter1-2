import { createObserver } from "./createObserver";
const BASE_URL = import.meta.env.VITE_BASE_URL || "";

export const createRouter = (routes) => {
  const { subscribe, notify } = createObserver();

  const getPath = () => window.location.pathname.replace(BASE_URL, "");

  const getTarget = () => routes[getPath()];

  const push = (path) => {
    window.history.pushState(null, null, `${BASE_URL}${path}`);
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
