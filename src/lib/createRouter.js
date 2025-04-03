import { createObserver } from "./createObserver";

const BASE_URL = import.meta.env.VITE_BASE_URL || "";

export const createRouter = (routes) => {
  const { subscribe, notify } = createObserver();

  // deploy 시에는 "/front_5th_chapter1-2/" 가 baseURL로 연결됨
  // "/" 만 제외하고, 제거
  // SSG 생성으로 /index.html -> /login/index.html, /profile/index.html 경로에 index.html 복제됨
  // 버튼으로 접근 시
  //   -> /front_5th_chapter1-2/profile -> /profile
  // github pages URL에 의해 접근 시
  //   -> /front_5th_chapter1-2/profile/(index.html) -> /profile/
  // 마지막에 / 까지 확인해서 제거 해야 routes[path]에서 알맞는 값의 컴포넌트를 가져올 수 있음
  // TODO routes 객체를 정의 할 때, "PROFILE" 과 같이 고유한 상수로 정의된 맵으로 컴포넌트와 연결해두고,
  //      pathname.replace(/[^a-zA-Z0-9]/g, "").toUpperCase() 로 매칭하는 방법이 더 좋은 방안일 것으로 예상됨

  const getPath = () => {
    let path = window.location.pathname;
    if (!!BASE_URL && path.startsWith(BASE_URL))
      path = path.slice(BASE_URL.length - 1);
    if (path.length > 1 && path.endsWith("/")) path = path.slice(0, -1);
    return path;
  };

  const getTarget = () => routes[getPath()];

  const push = (path) => {
    window.history.pushState(null, null, `${BASE_URL.slice(0, -1)}${path}`);
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
