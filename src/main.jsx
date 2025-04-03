/** @jsx createVNode */
import { createRouter, createVNode } from "./lib";
import { HomePage, LoginPage, ProfilePage } from "./pages";
import { globalStore } from "./stores";
import { ForbiddenError, UnauthorizedError } from "./errors";
import { router } from "./router";
import { render } from "./render";

const BASE_PATH = import.meta.env.PROD ? "/front_5th_chapter1-2" : "";

router.set(
  createRouter({
    [`${BASE_PATH}/`]: HomePage,
    [`${BASE_PATH}/login`]: () => {
      const { loggedIn } = globalStore.getState();
      if (loggedIn) {
        throw new ForbiddenError();
      }
      return <LoginPage />;
    },
    [`${BASE_PATH}/profile`]: () => {
      const { loggedIn } = globalStore.getState();
      if (!loggedIn) {
        throw new UnauthorizedError();
      }
      return <ProfilePage />;
    },
  }),
);

function main() {
  router.get().subscribe(render);
  globalStore.subscribe(render);

  render();
}

main();
