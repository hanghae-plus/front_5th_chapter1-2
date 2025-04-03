import { createObserver } from "./createObserver";

export const createRouter = (routes) => {
  const { subscribe, notify } = createObserver();
  const baseUrl = import.meta.env.BASE_URL;

  const getPath = () => {
    const path = window.location.pathname;

    if (baseUrl !== "/" && path.startsWith(baseUrl)) {
      return path.slice(baseUrl.length - 1) || "/";
    }

    return path;
  };

  const getTarget = () => routes[getPath()];

  const push = (path) => {
    console.log("baseUrl=>", baseUrl);

    const fullPath =
      baseUrl + (path.startsWith("/") ? path.substring(1) : path);

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
