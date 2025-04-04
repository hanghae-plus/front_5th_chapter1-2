/** @jsx createVNode */
// 초기화 함수
import { router } from "./router";
import { ForbiddenError, UnauthorizedError } from "./errors";
import { renderElement, createVNode } from "./lib";
import { NotFoundPage } from "./pages";
import { globalStore } from "./stores";

export function render() {
  const Page = router.get().getTarget() ?? NotFoundPage;
  const $root = document.querySelector("#root");

  try {
    //, try 안의 코드에서 예외가 발생하면 그걸 catch 블록이 "잡아서" 처리.
    const latestState = globalStore.getState();
    console.log("렌더링 시점의 최신 상태:", latestState); // 디버깅용

    //2.Pgae안에서 로그인 안 돼 있으면 throw (에러 던지기)
    const newVNode = Page(latestState);
    renderElement(newVNode, $root);
  } catch (error) {
    // throw? 에러 던졌어? 지금?오케이! 이 catch가 처리한다
    //1. error를 직접 던지는 방식으로 라우팅을 제어 하고 있기에 //
    if (error instanceof ForbiddenError) {
      router.get().push("/");
      return;
    }
    if (error instanceof UnauthorizedError) {
      router.get().push("/login"); //3.로그인 페이지로 이동동
      return;
    }
    console.error(error);
  }
}
