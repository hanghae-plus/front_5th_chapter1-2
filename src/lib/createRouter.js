import { createObserver } from "./createObserver";

export const createRouter = (routes) => {
  const { subscribe, notify } = createObserver();
  const baseUrl = import.meta.env.BASE_URL;

  // 경로에서 baseUrl 처리하는 함수
  const normalizePath = (path) =>
    baseUrl === "/" ? path : path.replace(new RegExp(`^${baseUrl}`), "/");

  // baseUrl 추가하는 함수
  const addBasePath = (path) =>
    baseUrl === "/" ? path : baseUrl + path.replace(/^\//, "");

  return {
    get path() {
      return normalizePath(window.location.pathname);
    },
    getTarget: () => routes[normalizePath(window.location.pathname)],
    push: (path) => {
      window.history.pushState(null, null, addBasePath(path));
      notify();
    },
    subscribe,
  };
};
