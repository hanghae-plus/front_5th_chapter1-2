import { createObserver } from "./createObserver";

export const createRouter = (routes, base = "/") => {
  // base 파라미터 추가
  const { subscribe, notify } = createObserver();

  // base path를 제거하고 실제 경로만 가져오는 함수
  const normalizePath = (path) => {
    return path.replace(base, "/").replace(/\/+/g, "/");
  };

  const getPath = () => {
    return normalizePath(window.location.pathname);
  };

  const getTarget = () => routes[getPath()];

  const push = (path) => {
    // base path를 포함한 전체 경로로 변환
    const fullPath =
      path === "/" ? base : `${base}${path}`.replace(/\/+/g, "/");
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
