/** @jsx createVNode */
// 초기화 함수
import { router } from "./router";
import { ForbiddenError, UnauthorizedError } from "./errors";
import { renderElement, createVNode } from "./lib/vdom";
import { NotFoundPage } from "./pages";

export function render() {
  const Page = router.get()?.getTarget() ?? NotFoundPage;
  const $root = document.querySelector("#root");

  try {
    renderElement(<Page />, $root as HTMLElement);
  } catch (error) {
    if (error instanceof ForbiddenError) {
      router.get()?.push("/");
      return;
    }
    if (error instanceof UnauthorizedError) {
      router.get()?.push("/login");
      return;
    }
    console.error(error);
  }
}
