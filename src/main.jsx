/** @jsx createVNode */
import { createRouter, createVNode } from "./lib";
import { HomePage, LoginPage, ProfilePage } from "./pages";
import { globalStore } from "./stores";
import { ForbiddenError, UnauthorizedError } from "./errors";
import { router } from "./router";
import { render } from "./render";

// 환경에 따른 basePath 설정
const isProduction = import.meta.env.PROD;
const basePath = isProduction ? "/front_5th_chapter1-2" : "";

router.set(
  createRouter(
    {
      "/": HomePage,
      "/login": () => {
        const { loggedIn } = globalStore.getState();
        if (loggedIn) {
          throw new ForbiddenError();
        }
        return <LoginPage />;
      },
      "/profile": () => {
        const { loggedIn } = globalStore.getState();
        if (!loggedIn) {
          throw new UnauthorizedError();
        }
        return <ProfilePage />;
      },
    },
    { basePath },
  ),
);

function main() {
  router.get().subscribe(render);
  globalStore.subscribe(render);

  render();
}

main();
