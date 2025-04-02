/** @jsx createVNode */
import { createHashRouter } from "./lib/router";
import { createVNode } from "./lib/vdom";
import { HomePage, LoginPage, ProfilePage } from "./pages";
import { userStore, postStore } from "./stores";
import { ForbiddenError, UnauthorizedError } from "./errors";
import { router } from "./router";
import { render } from "./render";

router.set(
  createHashRouter({
    "/": HomePage,
    "/login": () => {
      const { loggedIn } = userStore.getState();
      if (loggedIn) {
        throw new ForbiddenError();
      }
      return <LoginPage />;
    },
    "/profile": () => {
      const { loggedIn } = userStore.getState();
      if (!loggedIn) {
        throw new UnauthorizedError();
      }
      return <ProfilePage />;
    },
  }),
);

function main() {
  router.get()?.subscribe(render);
  userStore.subscribe(render);
  postStore.subscribe(render);

  render();
}

main();
