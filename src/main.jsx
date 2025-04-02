/** @jsx createVNode */
import { ForbiddenError, UnauthorizedError } from "./errors";
import { createRouter, createVNode } from "./lib";
import { HomePage, LoginPage, ProfilePage } from "./pages";
import { render } from "./render";
import { router } from "./router";
import { globalStore } from "./stores";

const base =
  process.env.NODE_ENV === "production" ? "/front_5th_chapter1-2" : "";
router.set(
  createRouter({
    [`${base}/`]: HomePage,
    [`${base}/login`]: () => {
      const { loggedIn } = globalStore.getState();
      if (loggedIn) {
        throw new ForbiddenError();
      }
      return <LoginPage />;
    },
    [`${base}/profile`]: () => {
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
