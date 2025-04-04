import { createObserver } from "./createObserver";

export const createRouter = (routes, options = {}) => {
  const { subscribe, notify } = createObserver();

  const getPath = () => {
    if (options.basePath) {
      return window.location.pathname.replace(options.basePath, "");
    }

    return window.location.pathname;
  };

  const getTarget = () => routes[getPath()];

  const push = (path) => {
    const fullPath = options.basePath ? options.basePath + path : path;
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
