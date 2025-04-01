import { ElementWithHandlers, VNode } from "@/types";
import { isValidVNode } from "@/utils/validator";
import { vDomStore } from "./../stores";
import { createElement } from "./createElement";
import { setupEventListeners } from "./eventManager";
import { normalizeVNode } from "./normalizeVNode";
import { updateElement } from "./updateElement";

// * 테스트 코드를 위한 Observer
// DOM에서 컨테이너가 제거될 때 vDomStore를 초기화하는 MutationObserver 설정
const setupContainerRemovalObserver = (container: ElementWithHandlers) => {
  // 이미 설정된 observer가 있는지 확인
  if ((container as any).__observer) return;

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === "childList") {
        mutation.removedNodes.forEach((node) => {
          // 제거된 노드가 우리가 관찰하는 컨테이너인지 확인
          if (node === container) {
            vDomStore.clear();
            observer.disconnect();
          }
        });
      }
    }
  });

  // document.body를 관찰하여 컨테이너가 제거되는지 감지
  observer.observe(document.body, { childList: true });

  // 컨테이너에 observer 참조 저장
  (container as any).__observer = observer;
};

export function renderElement(vNode: VNode, container: ElementWithHandlers) {
  // 최초 렌더링시에는 createElement로 DOM을 생성하고
  // 이후에는 updateElement로 기존 DOM을 업데이트한다.
  // 렌더링이 완료되면 container에 이벤트를 등록한다.
  const normalizedVNode = normalizeVNode(vNode);
  setupContainerRemovalObserver(container);

  const isVNodeObject = isValidVNode(normalizedVNode);

  if (!vDomStore.hasVDom()) {
    container.innerHTML = "";
    const element = createElement(normalizedVNode);

    setupEventListeners(container);

    container.appendChild(element);

    if (isVNodeObject) {
      vDomStore.saveVDom(normalizedVNode);
    }

    return element;
  } else {
    const previousVNode = vDomStore.get();
    updateElement(container, normalizedVNode, previousVNode);

    if (isVNodeObject) {
      vDomStore.saveVDom(normalizedVNode);
    }

    return container.firstChild;
  }
}
