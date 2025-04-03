import { createObserver } from "./createObserver";

export const createRouter = (routes) => {
  const baseUrl = import.meta.env.VITE_BASE_URL ?? "/";

  const { subscribe, notify } = createObserver();

  const getPath = () => {
    const fullPath = window.location.pathname;

    return baseUrl === "/"
      ? fullPath
      : fullPath.replace(new RegExp(`^${baseUrl}`), "");
  };

  console.log("getPath", getPath());

  const getTarget = () => routes[getPath()];

  const push = (path) => {
    const url = baseUrl === "/" ? path : `${baseUrl}${path}`;
    console.log("push", url);

    window.history.pushState(null, null, url);
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
