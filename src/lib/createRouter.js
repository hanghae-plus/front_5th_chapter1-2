import { createObserver } from "./createObserver";

export const createRouter = (routes) => {
  const { subscribe, notify } = createObserver();

  const basePath = import.meta.env.VITE_HOSTNAME || "/";

  const getPath = () => window.location.pathname.replace(basePath, "/");

  const getTarget = () => routes[getPath()];

  const push = (path) => {
    const formattedBasePath = basePath.endsWith("/")
      ? basePath.slice(0, -1)
      : basePath;
    window.history.pushState(null, null, `${formattedBasePath}${path}`);
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
