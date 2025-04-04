import { createObserver } from "./createObserver";

export const createRouter = (routes) => {
  const basename = import.meta.env.VITE_BASE_PATH || "";

  const { subscribe, notify } = createObserver();

  const getPath = () => {
    const fullPath = window.location.pathname;
    if (fullPath.startsWith(basename)) {
      return fullPath.slice(basename.length) || "/";
    }
    return fullPath;
  };

  const getTarget = () => routes[getPath()];

  const push = (path) => {
    const fullPath = basename + `${path}`;
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
