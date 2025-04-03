import { createObserver } from "./createObserver";

const BASE_PATH = import.meta.env.BASE_URL;

export const createRouter = (routes) => {
  const { subscribe, notify } = createObserver();

  const getPath = () => window.location.pathname.replace(BASE_PATH, "/");

  const getTarget = () => routes[getPath()];

  const push = (path) => {
    window.history.pushState(
      null,
      null,
      `${BASE_PATH}${path.replace("/", "")}`,
    );
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
