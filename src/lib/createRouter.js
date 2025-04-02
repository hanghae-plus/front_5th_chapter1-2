import { createObserver } from "./createObserver";
import { BASE_PATH } from "../utils/config";

export const createRouter = (routes) => {
  const { subscribe, notify } = createObserver();

  const getPath = () => {
    const path = window.location.pathname;
    // 프로덕션 환경에서는 기본 경로를 제거
    if (BASE_PATH !== "/" && path.startsWith(BASE_PATH)) {
      return path.slice(BASE_PATH.length - 1) || "/";
    }
    return path;
  };

  const getTarget = () => routes[getPath()];

  // 기본 경로를 고려한 push 함수
  const push = (path) => {
    const fullPath =
      BASE_PATH + (path.startsWith("/") ? path.substring(1) : path);
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
