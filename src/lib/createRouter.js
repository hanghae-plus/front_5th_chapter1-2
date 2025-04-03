import { createObserver } from "./createObserver";
import { formatPath } from "./formatPath";
import { getTargetPath } from "./getTargetPath";
export const createRouter = (routes) => {
  const { subscribe, notify } = createObserver();

  const getPath = () => formatPath(window.location.pathname);

  const getTarget = () => routes[getPath()];

  const push = (path) => {
    const targetPath = getTargetPath(path);
    window.history.pushState(null, null, targetPath);
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
