import { createObserver } from "./createObserver";
import { BASE_URL } from "./constData";

export const createRouter = (routes) => {
  const { subscribe, notify } = createObserver();

  const getPath = () => {
    return window.location.pathname.replace(BASE_URL, "");
  };

  const getTarget = () => routes[getPath()];

  const push = (path) => {
    path = `${BASE_URL}${path}`;
    window.history.pushState(null, null, path);
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
