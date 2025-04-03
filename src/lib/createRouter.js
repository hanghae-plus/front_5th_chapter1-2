import { createObserver } from "./createObserver";

export const createRouter = (routes) => {
  const { subscribe, notify } = createObserver();

  const baseUrl = import.meta.env.BASE_URL;

  // 경로 정규화 함수 추가
  const normalizePath = (path) => {
    // baseUrl을 제거하고 항상 시작이 /로 시작하도록 보장
    const cleanPath = path.replace(baseUrl, "") || "/";
    console.log("cleanPath", cleanPath);
    return cleanPath.startsWith("/") ? cleanPath : `/${cleanPath}`;
  };

  const getPath = () => normalizePath(window.location.pathname);
  console.log("window.location.pathname", window.location.pathname);
  console.log("getPath", getPath());

  const getTarget = () => routes[getPath()];

  const push = (path) => {
    // 경로 시작이 /로 시작하면 baseUrl과 합칠 때 // 가 생기는 것 방지
    const fullPath = `${baseUrl}${path.startsWith("/") ? path.slice(1) : path}`;
    console.log("fullPath", fullPath);
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
