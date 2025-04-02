import { createObserver } from "../observer";
import { BASE_PATH } from "../../consts/path";
import { VNode } from "../vdom/types";

export const createRouter = (routes: Record<string, () => VNode>) => {
  const { subscribe, notify } = createObserver();

  const getPath = () => {
    const path = window.location.pathname;
    return path.replace(BASE_PATH, "") || "/";
  };

  const getTarget = () => routes[getPath()];

  const push = (path: string) => {
    const fullPath = BASE_PATH + path;
    window.history.pushState(null, "", fullPath);
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
