import { REPO_URL } from "../../constants";
import { createObserver } from "./createObserver";

export const createRouter = (routes) => {
  const { subscribe, notify } = createObserver();

  const getPath = () => {
    const baseUrl = import.meta.env.MODE === "production" ? REPO_URL : "";
    return window.location.pathname.replace(baseUrl, "") || "/";
  };

  const getTarget = () => routes[getPath()];

  // const push = (path) => {
  //   window.history.pushState(null, null, `${BASE_URL}${path}`);
  //   notify();
  // };

  const push = (path) => {
    if (import.meta.env.MODE === "production") {
      const baseUrl = import.meta.env.MODE === "production" ? REPO_URL : "";
      const fullPath = baseUrl + path;

      window.history.pushState(null, null, fullPath);
    } else {
      window.history.pushState(null, null, path);
    }
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
