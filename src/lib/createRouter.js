import { createObserver } from "./createObserver";
import { BASE_URL } from "../constants/baseURL";

export const createRouter = (routes) => {
  const { subscribe, notify } = createObserver();

  const params = new URLSearchParams(window.location.search);
  const redirectPath = params.get("p");
  if (redirectPath?.startsWith("/")) {
    return window.history.pushState(
      null,
      null,
      BASE_URL + redirectPath.slice(1),
    );
  }

  const getPath = () => window.location.pathname.replace(BASE_URL, "/");

  const getTarget = () => routes[getPath()];

  const push = (path) => {
    window.history.pushState(null, null, BASE_URL + path.slice(1));
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
