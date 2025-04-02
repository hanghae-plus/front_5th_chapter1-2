import { setupEventListeners } from "./eventManager";
import { createElement } from "./createElement";
import { normalizeVNode } from "./normalizeVNode";
import { updateElement } from "./updateElement";

export function renderElement(vNode, container) {
  console.log(container, vNode, container._prevVNode);
  // container에 _oldNode 없다면 최초 렌더링
  const isFirst = !container.customOldNode;

  const normalizedVNode = normalizeVNode(vNode);

  // const element = createElement(normalizedVNode);
  // container.replaceChildren(element);
  // setupEventListeners(container);

  if (isFirst) {
    // 최초 렌더링시에는 createElement로 DOM을 생성하고
    const element = createElement(normalizedVNode);
    container.replaceChildren(element);
  } else {
    // 이후에는 updateElement로 기존 DOM을 업데이트한다.
    updateElement(container, normalizedVNode, container.customOldNode);
  }

  container.customOldNode = normalizeVNode;
  // 렌더링이 완료되면 container에 이벤트를 등록한다.
  setupEventListeners(container);
}
