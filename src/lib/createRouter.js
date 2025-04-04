import { createObserver } from "./createObserver";

export const createRouter = (routes) => {
  const BASE_URL = import.meta.env.VITE_PUBLIC_PATH || "/";
  const { subscribe, notify } = createObserver();

  const getPath = () => {
    const pathname = window.location.pathname;
    const clean = pathname.replace(BASE_URL, "") || "/";
    return clean.startsWith("/") ? clean : "/" + clean;
  };

  const getTarget = () => routes[getPath()];

  const joinPath = (base, path) => {
    return `${base.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
  };

  const push = (path) => {
    const fullPath = joinPath(BASE_URL, path);
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
