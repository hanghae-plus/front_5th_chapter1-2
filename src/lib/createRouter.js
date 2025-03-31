import { createObserver } from "./createObserver";

export const createRouter = (routes) => {
  const basePath = import.meta.env.VITE_BASE_PATH ?? "/";
  const { subscribe, notify } = createObserver();

  const formatPath = (path) => path.replace(basePath, "/");

  const getPath = () => formatPath(window.location.pathname);

  const getTarget = () => routes[getPath()];

  const push = (path) => {
    const newPath = formatPath(path);
    window.history.pushState(null, null, newPath);
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
